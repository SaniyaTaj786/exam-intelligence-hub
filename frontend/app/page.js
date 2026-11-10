"use client";
import React, { useState, useEffect } from 'react';

export default function ExamIntelligenceHub() {
  // Database State Hydrators
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Navigation & Toggle Panels Views
  const [activeTab, setActiveTab] = useState('80-mark'); 
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showChapterView, setShowChapterView] = useState(false);
  
  // Filtering & File Management Hooks
  const [importanceFilter, setImportanceFilter] = useState('All');
  const [marksFilter, setMarksFilter] = useState('All');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState("");
  // Pull existing processed questions and subjects straight from the MySQL tables
  const syncDatabaseContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0");
      if (!response.ok) throw new Error("Failed to connect to backend service storage tables.");
      
      const data = await response.json();
      setSubjects(data.subjects || []);
      setQuestions(data.questions || []);
      setErrorMessage("");
    } catch (err) {
      print(err);
      setErrorMessage("⚠️ Connection offline. Verify your python server terminal script is active.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data pool retrieval when dashboard components wake up
  useEffect(() => {
    syncDatabaseContent();
  }, []);

  // Auto-sync active selection parameters when switching weightage tabs
  useEffect(() => {
    const defaultSub = subjects.find(sub => sub.type === activeTab);
    setSelectedSubject(defaultSub || null);
    setMarksFilter('All');
    setImportanceFilter('All');
  }, [activeTab, subjects]);
  const filteredSubjects = subjects.filter(sub => sub.type === activeTab);
  const dynamicMarksOptions = selectedSubject?.type === '80-mark' ? ['2', '6', '8'] : ['2', '5', '10'];

  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject ? q.subject_id === selectedSubject.id : false;
    const matchesImportance = importanceFilter === 'All' ? true : q.importance === importanceFilter;
    const matchesMarks = marksFilter === 'All' ? true : q.marks.toString() === marksFilter;
    return matchesSubject && matchesImportance && matchesMarks;
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisFeedback(`Selected: ${e.target.files[0].name}`);
    }
  };
  // Dispatches uploaded model PDF sheets directly to the Python backend logic matching engine
  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      setAnalysisFeedback("⚠️ Error: Please browse and attach a question paper file first.");
      return;
    }
    if (!selectedSubject) {
      setAnalysisFeedback("⚠️ Error: Select a subject module card before hitting parse.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisFeedback("⚙️ Running Paper Intelligence Processing Algorithm...");

    const formData = new FormData();
    formData.append("subject_id", selectedSubject.id);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysisFeedback(`✅ Done! Extracted new high priority elements directly to database storage tables.`);
        await syncDatabaseContent(); // Live list update
      } else {
        setAnalysisFeedback(`❌ Engine Alert: ${data.detail || "Could not map targets"}`);
      }
    } catch (err) {
      setAnalysisFeedback("❌ Network Error: Verify connection strings.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      
      {/* Brand Setup Container reflecting your exact project name and design parameters */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200/60 rounded-2xl p-6 text-center shadow-sm mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          🧠 Exam Intelligence Hub
        </h1>
        <p className="text-blue-600 font-bold text-sm mt-1.5">
          🎓 Developed by: <span className="underline decoration-2">Saniya Taj</span>
        </p>
        <p className="text-slate-500 text-xs md:text-sm font-medium mt-2">
          Bangalore University Question Paper Pattern & High-Yield Analysis Dashboard Systems.
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-bold text-center mb-6">
          {errorMessage}
        </div>
      )}
      {/* Main Control Interface Panels Options */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
        <div>
          <button
            onClick={() => setShowChapterView(!showChapterView)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-lg shadow transition-all"
          >
            📖 {showChapterView ? "Hide Question Engine Panel" : "View Important Qs From Each Chapter"}
          </button>
        </div>

        {/* Dynamic Drag Drop Browsing Segment - Completely fixed tag closures here */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 max-w-xl mx-auto bg-slate-50/50">
          <div className="mb-4">
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg shadow cursor-pointer inline-flex items-center gap-2 transition-colors">
              📁 Browse Question Papers
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="block">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || loading}
              className={`font-bold text-xs md:text-sm px-6 py-3 rounded-lg shadow text-white transition-all ${
                isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isAnalyzing ? "Processing Data..." : "Run Paper Intelligence Analysis"}
            </button>
          </div>

          {analysisFeedback && (
            <p className="text-xs font-bold mt-4 text-slate-600 bg-white border border-slate-200 p-2.5 rounded-md inline-block">
              {analysisFeedback}
            </p>
          )}
        </div>
      </div>
      {/* Chapter lists drop rendering anchors */}
      {showChapterView && !loading && (
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex justify-center space-x-3 mb-6">
            <button onClick={() => setActiveTab('80-mark')} className={`px-4 py-2 rounded-md text-xs font-bold ${activeTab === '80-mark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>📚 Core Disciplines (80m)</button>
            <button onClick={() => setActiveTab('40-mark')} className={`px-4 py-2 rounded-md text-xs font-bold ${activeTab === '40-mark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>⚡ Value Courses (40m)</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {filteredSubjects.map(sub => (
              <div key={sub.id} onClick={() => setSelectedSubject(sub)} className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${selectedSubject?.id === sub.id ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-bold text-slate-800">{sub.name}</h4>
              </div>
            ))}
          </div>
          {selectedSubject && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{selectedSubject.name} Streams</span>
                <div className="flex gap-2">
                  <select onChange={(e) => setImportanceFilter(e.target.value)} className="text-xs font-bold bg-slate-100 border p-1 rounded">
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map(q => (
                    <div key={q.id} className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded">{q.marks}M Pattern</span>
                        <span className={`text-[10px] font-bold uppercase ${q.importance === 'High' ? 'text-red-500' : q.importance === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>● {q.importance} Yield</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-2">{q.question_text}</p>
                      <details className="group border-t border-slate-100 pt-2">
                        <summary className="list-none flex justify-between text-[11px] font-bold text-blue-600 cursor-pointer">
                          <span>💡 REVIEW BU EXAM ANSWER SCHEME</span>
                          <span>▼</span>
                        </summary>
                        <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border leading-relaxed">{q.answer_text}</p>
                      </details>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold">No sorted data items match your active filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        ⚡ Engine Active Platform System
      </footer>
    </div>
  );
}
