'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' or 'all-subjects'
  const [selectedSubject, setSelectedSubject] = useState('artificial_intelligence');
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const BU_EXAM_REPOSITORY = {
    artificial_intelligence: {
      title: "Artificial Intelligence (AI)",
      max_marks: 80,
      pattern: "2 Marks, 6 Marks, and 8 Marks Structure",
      topics: ["Intelligent Agents", "PEAS Framework", "Advanced Search (A*, BFS, DFS, Minimax)", "Alpha-Beta Pruning", "Propositional Logic", "First-Order Predicate Logic", "Unification & Resolution", "Truth Maintenance Systems", "Blocks World & STRIPS", "Fuzzy Logic & Expert Systems"],
      questions: {
        "2_marks": [
          "Define Artificial Intelligence. [★ 2026 Higher Priority]",
          "What is an Intelligent Agent?",
          "Define Rationality in Artificial Intelligence.",
          "What is a Knowledge-Based Agent?",
          "What is a Goal-Based Agent?",
          "Define Agent Program.",
          "What is PEAS representation?",
          "What is a Reflex Agent?",
          "Define Breadth-First Search (BFS) and Depth-First Search (DFS).",
          "What is a Heuristic Function in A* Search?",
          "Define Minimax Algorithm and Alpha-Beta Pruning.",
          "Define Genetic Algorithm and Constraint Satisfaction Problem (CSP).",
          "Define Propositional Logic and First-Order Predicate Logic.",
          "Define Unification and Resolution principles.",
          "What is a Truth Maintenance System (TMS)? [★ 2026 Target]",
          "Define Fuzzy Logic and Non-Monotonic Reasoning.",
          "What is Machine Learning and an Expert System? [★ 2026 Core]"
        ],
        "6_marks": [
          "Explain the characteristics of an Intelligent Agent.",
          "Explain the PEAS representation of Wumpus World with a clean scenario breakdown.",
          "Explain the different types of environments encountered in AI architectures.",
          "Explain the structure and operational loop of a Model-Based Reflex Agent.",
          "Explain the working of a Simple Reflex Agent accompanied by its standard diagram structure.",
          "Write out and explain the comprehensive state algorithm for Breadth-First Search (BFS). [★ 2026]",
          "Explain Depth-First Search (DFS) along with its distinct advantages and performance disadvantages.",
          "Explain Iterative Deepening Search (IDS) with an illustrative step-by-step example execution.",
          "Explain the internal working mechanisms of the A* Search Algorithm with a clear step evaluation trace.",
          "Explain the operational steps of the Minimax Algorithm using a suitable game theory instance.",
          "Explain the formulation and properties of Constraint Satisfaction Problems (CSPs) with concrete examples.",
          "Differentiate clearly between Forward Chaining and Backward Chaining inference methods.",
          "Explain the complete five phases of Natural Language Processing (NLP) systems.",
          "Explain different structural types of ambiguity encountered inside Natural Language Processing (NLP)."
        ],
        "8_marks": [
          "Explain the architecture and internal structure of Intelligent Agents with a neat schematic diagram.",
          "Explain the various types of Intelligent Agents with suitable operational examples for each category.",
          "Explain the complete environment layout and grid structure of the Wumpus World problem scenario.",
          "Explain A* Search Algorithm in depth detailing its evaluation function f(n) = g(n) + h(n) with a graph matrix.",
          "Explain the Alpha-Beta Pruning technique inside adversarial search, detailing the exact alpha/beta state updates.",
          "Explain Unification and Resolution mechanisms inside First-Order Logic using a collection of predicate expressions.",
          "Convert complex English declarative sentences systematically into precise First-Order Predicate Logic statements.",
          "Explain the Blocks World problem structure and its actions broken down into the STRIPS planning representation.",
          "Explain the architecture, components, and workflow of Expert Systems using an architectural block diagram."
        ]
      }
    },
    database_management_system: {
      title: "Database Management System (DBMS)",
      max_marks: 80,
      pattern: "2 Marks, 6 Marks, and 8 Marks Structure",
      topics: ["Database Architecture & Users", "ER Modeling & Key Constraints", "Relational Algebra Operations", "Structured Query Language (SQL DDL/DML)", "Normalization (1NF to BCNF)", "Transaction Management & ACID", "Concurrency Locking (2PL)", "Deadlocks & Storage Indexing", "NoSQL Foundations & MongoDB"],
      questions: {
        "2_marks": [
          "Define DBMS and Database parameters.",
          "Who is a Database Administrator (DBA)? Describe their role.",
          "What is a Data Model? List the main types.",
          "Define an Entity with a business logic example.",
          "Define Candidate Key, Primary Key, Super Key, and Foreign Key forms.",
          "What is a Weak Entity? Give an explicit setup.",
          "Define Referential Integrity parameters.",
          "Define Relational Algebra operational expressions.",
          "What is Selection Operation vs Projection Operation?",
          "Define Functional Dependency and state Armstrong's Axioms explicitly.",
          "Define Normalization parameters. What is 1NF, 2NF, 3NF, and BCNF?",
          "What is a Transaction in DBMS? Define ACID Properties.",
          "Define Serial Schedule and Serializability rules.",
          "Define Two-Phase Locking (2PL). What is a Shared Lock vs Exclusive Lock?",
          "Define Indexing inside databases. What is a Primary Index?",
          "Define NoSQL. What is the core structure of CAP Theorem?"
        ],
        "6_marks": [
          "Explain the advantages and disadvantages of DBMS.",
          "Explain the Relational Data Model and its features with examples.",
          "Explain Unary Operations in Relational Algebra (SELECT and PROJECT) using sample relation tuple equations.",
          "Explain Set Operations in Relational Algebra: UNION, INTERSECTION, DIFFERENCE, and CARTESIAN PRODUCT.",
          "Explain different structural types of JOIN Operations (Inner, Natural, Full Outer, Left Outer, Equi Join) with setups.",
          "Explain DDL Statements (CREATE, ALTER, DROP, TRUNCATE) including clear syntax structures and table mutations.",
          "Explain DML Statements (SELECT, INSERT, UPDATE, DELETE) including clean query clauses and tuple targets.",
          "Explain SQL Constraints: NOT NULL, DEFAULT, UNIQUE, CHECK, PRIMARY KEY, and FOREIGN KEY mechanics.",
          "Explain ACID Properties clearly by walking through a real-life banking balance transfer scenario.",
          "Explain Strict Two-Phase Locking along with its core performance rules, advantages, and drawbacks.",
          "Explain the operational steps of Deadlock Detection inside a system using a Wait-For Graph structure.",
          "Compare SQL and NoSQL databases across tabular formats, scalability vectors, schemas, and indexing strategies.",
          "Explain CRUD Operations inside MongoDB database environments using concrete command line query examples."
        ],
        "8_marks": [
          "Compare the Traditional File-Based Approach and modern Database Approach across data redundancy, access control, and isolation.",
          "Explain the core Data Models: Hierarchical Data Model, Network Data Model, Relational Data Model, and Object-Oriented layouts.",
          "Draw and explain a comprehensive Entity-Relationship (ER) Diagram for a complete Student-Course Database including attributes.",
          "Explain Normalization in Database Design by thoroughly analyzing 1NF, 2NF, 3NF, and Boyce-Codd Normal Form (BCNF) dependencies.",
          "Explain Functional Dependencies, Attribute Closure algorithm computations, and Armstrong's Inference Axioms definitions.",
          "Explain Serializability and Recoverability properties of execution schedules inside advanced Transaction Management workflows.",
          "Explain advanced File Organization Techniques: Heap, Sequential, Hashed, and Clustered File structural patterns."
        ]
      }
    },
    probability_and_statistics: {
      title: "Probability and Statistics (PS)",
      max_marks: 80,
      pattern: "2 Marks, 6 Marks, and 8 Marks Structure",
      topics: ["Central Tendency (Mean, Median, Mode)", "Measures of Dispersion & Variance", "Correlation Coefficient & Regression Lines", "Probability Rules & Bayes' Theorem", "Random Variables (PMF/PDF)", "Probability Distributions (Binomial, Poisson, Normal)", "Sampling Distributions & Central Limit Theorem", "Hypothesis Testing & Estimation Rules"],
      questions: {
        "2_marks": [
          "Define Statistics in both its singular sense and plural interpretation context.",
          "Mention any four core characteristics and limitations of modern Statistical analysis frameworks.",
          "Define Frequency Distribution alongside Class Interval and Class Width terms.",
          "Define Arithmetic Mean, Median, and Mode constants.",
          "Define Qualitative Data vs Quantitative Data properties.",
          "Define Standard Deviation, Range, Variance, and Quartile Deviation metrics.",
          "Define Correlation and describe its basic Correlation Coefficient parameter.",
          "State the core Principle of Least Squares used inside linear mathematical modelling.",
          "What is Spearman's Rank Correlation? When is it used?",
          "Define Random Variable parameters. What is a Discrete vs Continuous variable?",
          "Define Probability Mass Function (PMF) vs Probability Density Function (PDF) models.",
          "Define Null Hypothesis and Alternative Hypothesis statements used inside inference routines."
        ],
        "6_marks": [
          "Explain the critical sequential stages involved inside a formal Statistical Investigation workflow.",
          "Explain the precise step-by-step procedure for constructing a grouped Frequency Distribution table.",
          "Explain the distinct mathematical merits and operational demerits of Arithmetic Mean, Median, and Mode.",
          "Explain standard Measures of Dispersion with appropriate conceptual examples matching real-world distributions.",
          "Explain the functional differences and variance between Correlation Analysis and Regression Analysis frameworks.",
          "Explain the operational steps to calculate Spearman's Rank Correlation Coefficient under tied and untied scenario structures.",
          "Explain the functional properties, symmetry parameters, and visual characteristics of the Normal Probability Distribution.",
          "Explain the foundational concepts of Point Estimation and Interval Estimation along with their distinct properties.",
          "Explain Type I Error and Type II Error scenarios within statistical decision tree systems."
        ],
        "8_marks": [
          "Explain Measures of Central Tendency (Mean, Median, Mode) including comprehensive formulas for continuous series.",
          "Explain Measures of Dispersion (Range, Quartile Deviation, Mean Deviation, Standard Deviation) alongside absolute and relative coefficient metrics.",
          "Explain the different classification states of Correlation (Positive, Negative, Zero, Linear, Non-linear) mapped onto clear Scatter Diagrams.",
          "Derive the complete Least Squares Normal Equations sequence (Y on X) to fit a standard linear mathematical regression line model.",
          "State and mathematically explain the general Addition and Multiplication Rules of Probability across dependent and independent event scenarios.",
          "State Bayes' Theorem explicitly and construct a full numerical problem solution mapping its conditional distribution tree path.",
          "Explain the Central Limit Theorem (CLT) and demonstrate its deep structural value toward large-sample data analysis."
        ]
      }
    },
    feature_engineering: {
      title: "Feature Engineering (FE)",
      max_marks: 40,
      pattern: "2 Marks, 5 Marks, and 10 Marks Structure",
      topics: ["Data Types & Core Scaling", "Missing Data Imputation Strategies", "Data Cleaning & Pre-processing Pipelines", "Categorical Encoding (One-Hot & Label)", "Interaction & Polynomial Synthesis", "Feature Selection vs Feature Extraction", "Principal Component Analysis (PCA)", "Dimensionality Reduction Layouts"],
      questions: {
        "2_marks": [
          "Define Feature Engineering and detail its critical position inside Machine Learning workflows.",
          "Define Normalization vs Standardization parameters.",
          "What is Data Pre-processing? Why is it essential for non-linear estimators?",
          "What is Data Cleaning? List the main tasks involved.",
          "Define Continuous, Discrete, Nominal, and Ordinal data attributes.",
          "What is Feature Scaling? Why is it highly mandatory for distance-based estimators?",
          "How do you handle Missing Data? List the simplest remediation vectors.",
          "Define Feature Selection vs Feature Extraction paradigms.",
          "What is an Interaction Feature? How does it help capture non-linear relationships?",
          "What is Dimensionality Reduction? List two common methodologies.",
          "What is Binning? Describe its value toward managing high numerical variance data.",
          "What is Principal Component Analysis (PCA)? Define eigenvalues simply.",
          "Differentiate briefly between Label Encoding and One-Hot Encoding."
        ],
        "5_marks": [
          "Explain different semantic types of data (Numerical, Categorical, Discrete, Continuous, Interval, Ratio) with explicit dataset field examples.",
          "Explain Missing Data categories (MCAR, MAR, MNAR) and outline structural imputation methodologies.",
          "Write a detailed structural note on Normalization (Min-Max Scaling) vs Standardization (Z-score Normalization) implementations.",
          "Explain the core strategic steps and sequence actions involved during data pipelines for Data Cleaning tasks.",
          "Explain the role of Data Visualization patterns during exploratory data analysis (EDA) before transformations.",
          "Explain Binning and Discretization techniques, detailing how they control noise spikes inside continuous features.",
          "Differentiate structurally between One-Hot Encoding and Label Encoding across dimensionality extension and label order constraints.",
          "Explain the core structural steps involved inside Principal Component Analysis (PCA) algorithm processing."
        ],
        "10_marks": [
          "Explain in rich detail the end-to-end Data Pre-processing pipeline sequence steps along with appropriate calculation methods.",
          "Explain various Feature Selection techniques by deeply reviewing and contrasting Filter methods, Wrapper methods, and Hybrid architectures.",
          "Explain Principal Component Analysis (PCA) mathematically from covariance matrix initialization down to dimension reduction mapping projection."
        ]
      }
    },
    indian_constitutional_values: {
      title: "Indian Constitutional Values (CV1)",
      max_marks: 40,
      pattern: "2 Marks, 5 Marks, and 10 Marks Structure",
      topics: ["Preamble Objectives & Relevance", "Constituent Assembly Composition", "Core Pillars (Sovereignty, Justice, Liberty)", "Fundamental Rights & Duties", "Directive Principles of State Policy (DPSP)", "Citizenship Acquisition Procedures", "Democratic Institutions & Roles", "Right to Education, Health, and Privacy"],
      questions: {
        "2_marks": [
          "What is a Constitution? Define it in modern legal theory terms.",
          "What is a Republic? Explain its democratic representation base.",
          "What is the Right to Equality? State its main article grouping.",
          "Mention any two distinct Fundamental Rights protected under Part III.",
          "What is Diversity? Describe its application across the Indian landscape.",
          "What is Citizenship? Define the national identity bond.",
          "What is Sovereignty? Describe internal and external legal independence.",
          "Mention any two distinct core objectives embedded within the Preamble text.",
          "What is a Preamble? Explain its introductory constitutional character.",
          "Mention any two distinct Fundamental Duties expected under Article 51A.",
          "How many original Articles, Parts, and Schedules were present inside the 1950 Indian Constitution setup?"
        ],
        "5_marks": [
          "Explain the semantic meaning, legal nature, and ongoing systemic relevance of Constitutional Values.",
          "State the basic, immutable objectives written within the Preamble of the Indian Constitution.",
          "Explain Jawaharlal Nehru's visionary contribution toward the crafting and direction of the Indian Constitution.",
          "Explain the fundamental responsibilities and code expectations laid down under the Fundamental Duties framework.",
          "Explain the social importance and governance transformative impact of the Right to Information (RTI) Act.",
          "Explain the role and monumental leadership contribution of Dr. B.R. Ambedkar in shaping the Indian Constitution structure.",
          "Explain the precise legal methods and procedures used for acquiring status under Indian Citizenship rules.",
          "Explain the operational meaning and systemic importance of Liberty, Equality, and Fraternity constants."
        ],
        "10_marks": [
          "Discuss the salient features of the Indian Constitution (Rigidity vs Flexibility, Federal structure with Unitary bias, Independent Judiciary). [★ Repeated High Priority]",
          "Examine the critical role of citizens in sustaining a vibrant democracy and executing progressive nation building tasks. [★ Repeated High Priority]",
"Explain the Fundamental Rights of Indian Citizens by detailing the protection parameters from Article 14 through Article 32.",
"Analyze the Directive Principles of State Policy (DPSP) by evaluating Socialistic, Gandhian, and Liberal-Intellectual categories.",
"Discuss the making of the Indian Constitution by reviewing the key debates and timeline transitions of the Constituent Assembly."
]
}
},
english: {
title: "English Literary & Language Components",
max_marks: 80,
pattern: "2 Marks, 5 Marks, and 10 Marks Structure",
topics: ["What then, Raman? (Shirley L Arora)", "The Doctor's Word (R K Narayan)", "Sita Speaks to the Dark Lord (Meena Kandasamy)", "The Trial For Murder (Charles Dickens)", "The Patriot (Robert Browning)", "Grammar Mechanics & Spotting Common Errors", "Corporate Communication & Team Building Skills"],
questions: {
"2_marks": [
"Who wrote the text narrative 'What then, Raman?'?",
"Identify the core existential conflict central to R K Narayan's 'The Doctor's Word'.",
"What is the central tone within Meena Kandasamy's 'Sita Speaks to the Dark Lord'?",
"Name the author of the supernatural short story 'The Trial For Murder'.",
"Who is the main speaker inside Robert Browning's dramatic monologue 'The Patriot'?",
"What is a Cloze Test? State its value within verbal profiling metrics.",
"Define the concept of Verbal Analogy models simply."
],
"5_marks": [
"Describe the internal dilemma and academic pressure experienced by Raman inside Shirley L Arora's narrative text.",
"Discuss the conflict between absolute medical truth and compassionate professional duty inside R K Narayan's 'The Doctor's Word'.",
"Analyze Meena Kandasamy's powerful poetic subversion of classical mythical imagery in her poem composition.",
"Explain the elements of gothic mystery and psychological suspense built across Dickens' 'The Trial For Murder'.",
"How does Robert Browning capture the volatile nature of public adoration and political fickleness within 'The Patriot'?",
"Explain common grammatical error categories including subject-verb agreement anomalies and modifier misplacements."
],
"10_marks": [
"Write a comprehensive literary analytical essay tracking the core humanistic themes explored across this semester's anthology syllabus.",
"Explain the key principles of effective Corporate Communication by reviewing negotiation frameworks and team dynamic building strategies.",
"Detail the complete list of Job Skills required to successfully navigate advanced Technical Interviews and highly competitive Group Discussions."
]
}
}
};
  // Automated subject keyword mapper engine (simulates the text processing system)
  const handleFileUploadMock = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setAnalysisResult(null);

    // Simulate system PDF processing lag
    setTimeout(() => {
      const file = files[0];
      const fileNameLower = file.name.toLowerCase();
      let matchedKey = 'artificial_intelligence'; // default fallback subject state

      if (fileNameLower.includes('dbms') || fileNameLower.includes('database') || fileNameLower.includes('sql')) {
        matchedKey = 'database_management_system';
      } else if (fileNameLower.includes('stat') || fileNameLower.includes('prob') || fileNameLower.includes('statistics')) {
        matchedKey = 'probability_and_statistics';
      } else if (fileNameLower.includes('feature') || fileNameLower.includes('engineering') || fileNameLower.includes('pca')) {
        matchedKey = 'feature_engineering';
      } else if (fileNameLower.includes('const') || fileNameLower.includes('constitution') || fileNameLower.includes('values')) {
        matchedKey = 'indian_constitutional_values';
      } else if (fileNameLower.includes('eng') || fileNameLower.includes('english') || fileNameLower.includes('raman')) {
        matchedKey = 'english';
      }

      setAnalysisResult(BU_EXAM_REPOSITORY[matchedKey]);
      setSelectedSubject(matchedKey);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            {/* Premium Navigation Header Controllers */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex space-x-2 transition-colors duration-300">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            activeTab === 'analyzer'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📄 Question Paper Analyzer</span>
        </button>
        <button
          onClick={() => setActiveTab('all-subjects')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            activeTab === 'all-subjects'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🎯 Subject Wise Important Questions</span>
        </button>
      </div>

      {/* View Mode 1: PDF Automated Analyzer Layout */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 h-fit transition-colors duration-300">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Upload Prior Year Paper</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a PDF format exam paper file. The system will instantly process keywords and map out your syllabus priorities.</p>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-900/30 group relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUploadMock}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />
              <div className="space-y-3 pointer-events-none">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">📥</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload file or drag & drop</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">Accepts University PDF papers</div>
              </div>
            </div>
  

            {uploading && (
              <div className="flex items-center justify-center space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-xs font-semibold text-blue-700">Extracting text & mapping keywords...</span>
              </div>
            )}

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-[11px] leading-relaxed text-amber-800 space-y-1">
              <div className="font-bold uppercase tracking-wider text-[10px] text-amber-900 flex items-center space-x-1">
                <span>⚠️</span> <span>System Operational Rules:</span>
              </div>
              <p>1. Target papers map dynamically using key text tokens matching the Bangalore University course definitions.</p>
              <p>2. Pre-calculated weight priority highlights questions that have been officially flagged as high probability for upcoming terms.</p>
            </div>
          </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fadeIn transition-colors duration-300">

            {analysisResult ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Automated Mapping Complete</span>
                      <h3 className="text-lg font-bold mt-2">{analysisResult.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black">{analysisResult.max_marks} M</div>
                      <div className="text-[10px] opacity-75 font-semibold tracking-wide">University Max Limit</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs font-medium opacity-90 flex items-center space-x-2">
                    <span>📊 Mapped Pattern Structure:</span>
                    <span className="font-bold underline underline-offset-4">{analysisResult.pattern}</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {Object.entries(analysisResult.questions).map(([key, list]) => (
                    <div key={key} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-2">
                        <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                        <span className="capitalize">{key.replace('_', ' ')} Portfolio</span>
                      </h4>
                      <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        {list.map((q, index) => (
                          <li key={index} className="p-3.5 text-xs bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-start space-x-3">
                            <span className="text-slate-400 font-mono select-none">{(index + 1).toString().padStart(2, '0')}.</span>
                            <span className="flex-1 leading-relaxed">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center text-slate-400 space-y-3 min-h-[350px]">
                <div className="text-4xl">📊</div>
                <div className="text-sm font-bold text-slate-700">Terminal Processing Queue Empty</div>
                <p className="text-xs max-w-sm text-slate-500">Please select and upload a prior year university question paper using the sidebar module file input to initialize token matching.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode 2: Subject Matrix Dashboard */}
      {activeTab === 'all-subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Subject Grid Selectors */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fadeIn transition-colors duration-300">

            {Object.entries(BU_EXAM_REPOSITORY).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedSubject(key)}
                className={`w-full text-left p-4 rounded-xl border text-xs font-bold transition-all duration-150 flex flex-col space-y-1 ${
                  selectedSubject === key
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm translate-x-1'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.title}</span>
                <span className={`text-[10px] font-medium ${selectedSubject === key ? 'text-blue-500' : 'text-slate-400'}`}>
                  Pattern: {item.max_marks} Marks ({item.max_marks === 80 ? '2,6,8 Scheme' : '2,5,10 Scheme'})
                </span>
              </button>
            ))}
          </div>

          {/* Right Subject Matrix Visualizer Viewport */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{BU_EXAM_REPOSITORY[selectedSubject].title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Bangalore University Standard Syllabus Important Questions Pool</p>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-sm">
                <div className="text-xs font-extrabold text-slate-800">{BU_EXAM_REPOSITORY[selectedSubject].max_marks} Total Marks</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Course Limit</div>
              </div>
            </div>

            {/* Course Core Concept Cloud Anchor */}
            <div className="p-6 bg-blue-50/30 border-b border-slate-100">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2.5">Syllabus Focus Fields:</h4>
              <div className="flex flex-wrap gap-1.5">
                {BU_EXAM_REPOSITORY[selectedSubject].topics.map((t, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(BU_EXAM_REPOSITORY[selectedSubject].questions).map(([sectionKey, questionList]) => (
                <div key={sectionKey} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center space-x-2">
                    <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                    <span className="capitalize">{sectionKey.replace('_', ' ')} Requirement</span>
                  </h4>
                  <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/10">
                    {questionList.map((q, idx) => (
                      <li key={idx} className="p-3.5 text-xs bg-white text-slate-700 font-medium hover:bg-slate-50/50 transition-colors flex items-start space-x-3">
                        <span className="text-slate-400 font-mono select-none">{(idx + 1).toString().padStart(2, '0')}.</span>
                        <span className="flex-1 leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
