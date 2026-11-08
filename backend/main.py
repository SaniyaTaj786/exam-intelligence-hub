import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import pypdf
import json
import mysql.connector
from mysql.connector import pooling
from typing import List

app = FastAPI(title="Exam Intelligence Hub API")

# Enable CORS so your frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🗄️ LIVE DATABASE CONNECTION POOL SETUP
# ==========================================
db_config = {
    "pool_name": "mypool",
    "pool_size": 5,
    "host": "localhost",
    "user": "root",        
    "password": "Saniya@786",
    "database": "exam_hub",
    "port": 3306
}

try:
    connection_pool = pooling.MySQLConnectionPool(**db_config)
    print("🚀 Database connection pool initialized successfully!")
except Exception as e:
    print(f"❌ Error creating MySQL connection pool: {e}")
    connection_pool = None

def save_to_database(filename: str, raw_text: str):
    """Saves the uploaded file metadata and parsed lines securely into your database tables."""
    if not connection_pool:
        print("❌ Database connection pool unavailable. Skipping save log.")
        return
    
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    try:
        # Step A: Insert into question_papers tracker
        insert_paper_query = "INSERT INTO question_papers (filename) VALUES (%s)"
        cursor.execute(insert_paper_query, (filename,))
        paper_id = cursor.lastrowid

        # Step B: Break text into clean, readable lines
        lines = [line.strip() for line in raw_text.split('\n') if len(line.strip()) > 15]
        
        # Step C: Batch insert individual lines into extracted_questions
        insert_question_query = "INSERT INTO extracted_questions (paper_id, question_text) VALUES (%s, %s)"
        data_to_insert = [(paper_id, line) for line in lines[:50]] # Limit to first 50 main statements for testing
        
        if data_to_insert:
            cursor.executemany(insert_question_query, data_to_insert)
            connection.commit()
            print(f"✅ Successfully logged '{filename}' and its data to the database!")
    except Exception as e:
        connection.rollback()
        print(f"❌ Database save error: {e}")
    finally:
        cursor.close()
        connection.close()

# Initialize OpenAI Client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "your-openai-api-key"))

def extract_text_from_pdf(file: UploadFile) -> str:
    """Extracts raw text content from an uploaded PDF file."""
    try:
        pdf_reader = pypdf.PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

@app.post("/analyze-papers")
async def analyze_papers(files: List[UploadFile] = File(...)):
    """Receives multiple question paper files, parses them, detects repeating questions, and generates answers."""
    combined_text = ""
    
    for file in files:
        # 1. Validate file extension
        if not file.filename.endswith('.pdf') and not file.filename.endswith('.txt'):
            raise HTTPException(status_code=400, detail=f"File {file.filename} format not supported. Only .pdf and .txt are allowed.")
        
        # 2. Extract content
        if file.filename.endswith('.pdf'):
            raw_text = extract_text_from_pdf(file)
        else:
            content = await file.read()
            raw_text = content.decode("utf-8")
            
        if raw_text.strip():
            combined_text += f"\n--- Start of Paper: {file.filename} ---\n" + raw_text
            # Save historical records into your local database tables dynamically
            save_to_database(file.filename, raw_text)

    if not combined_text.strip():
        raise HTTPException(status_code=400, detail="None of the uploaded files contained readable text.")

        # 3. Construct AI analysis prompt (Updated to include explicit chart plotting numbers)
    system_prompt = (
        "You are an expert academic evaluator. Your job is to analyze text from multiple past exam papers collectively, "
        "identify which questions or concepts repeat across different years, and extract the most important questions. "
        "Crucially, you must also provide standard, accurate, high-scoring academic answers for each identified question, "
        "and calculate numerical distribution data for rendering visual analytics charts.\n\n"
        "You must respond ONLY with a valid JSON object matching this structure exactly:\n"
        "{\n"
        "  \"summary\": \"Brief overview of recurring trends and topic distributions found across these papers.\",\n"
        "  \"chart_data\": [\n"
        "    { \"topic\": \"Chapter/Topic A Name\", \"weight\": 45 },\n"
        "    { \"topic\": \"Chapter/Topic B Name\", \"weight\": 30 },\n"
        "    { \"topic\": \"Chapter/Topic C Name\", \"weight\": 25 }\n"
        "  ],\n"
        "  \"important_questions\": [\n"
        "    {\n"
        "      \"topic\": \"Topic/Chapter Name\",\n"
        "      \"question\": \"The highly repeated or high-yield reference question statement\",\n"
        "      \"priority\": \"High\" or \"Medium\",\n"
        "      \"repetition_count\": \"Estimated times matched (e.g., Found in 3 out of 4 papers)\",\n"
        "      \"answer\": \"The comprehensive, accurate structural answer or standard marking scheme solution for this question.\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )


    user_prompt = f"Analyze these collective past exam question papers, cross-reference them for repetitions, and output the target questions along with their answers:\n\n{combined_text[:12000]}" 

    try:
        # 4. Request Analysis from OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2 
        )
        
        analysis_result = json.loads(response.choices[0].message.content)
        return analysis_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI System Processing failed: {str(e)}")

# =========================================================================
# 🛡️ USER AUTHENTICATION ENDPOINTS
# =========================================================================

class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/signup")
async def signup(user_data: SignUpRequest):
    """Registers a new user account safely into the MySQL database table."""
    if not connection_pool:
        raise HTTPException(status_code=500, detail="Database connection pool unavailable.")
        
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    try:
        # Check if username or email already exists to prevent duplicate entries
        check_query = "SELECT id FROM system_users WHERE username = %s OR email = %s"
        cursor.execute(check_query, (user_data.username, user_data.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or Email already registered.")

        # For strict production apps, passwords should be encrypted/hashed. 
        # Storing directly for this development iteration loop to keep setups straightforward.
        insert_user_query = """
            INSERT INTO system_users (username, email, password_hash) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_user_query, (user_data.username, user_data.email, user_data.password))
        connection.commit()
        return {"message": "User account registered successfully! You can now log in."}
        
    except mysql.connector.Error as err:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(err)}")
    finally:
        cursor.close()
        connection.close()

@app.post("/login")
async def login(credentials: LoginRequest):
    """Validates user account logging details against saved database data records."""
    if not connection_pool:
        raise HTTPException(status_code=500, detail="Database connection pool unavailable.")
        
    connection = connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True) # Returns records as a dictionary
    try:
        login_query = "SELECT id, username, email FROM system_users WHERE username = %s AND password_hash = %s"
        cursor.execute(login_query, (credentials.username, credentials.password))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=400, detail="Invalid username or password credentials.")
            
        return {"message": "Login successful!", "user": user}
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database operational error: {str(err)}")
    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
