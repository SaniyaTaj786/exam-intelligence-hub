'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ExamHub() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [showChapterGuide, setShowChapterGuide] = useState(false);
  const [dbManualData, setDbManualData] = useState([]); 
  const [activeSubjectTab, setActiveSubjectTab] = useState('');

  // Comprehensive fail-safe database dictionary matching all subjects completely
  const fallbackManualData = {
    "ARTIFICIAL INTELLIGENCE": [
      { chapter: "Unit I", repetition_count: "Repeated 6 times", priority: "High", question: "[2 Marks] Define the term Turing Test in AI.", answer: "A test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human." },
      { chapter: "Unit I", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Detail the structure of Goal-Based and Utility-Based Intelligent Agents with neat schematics.", answer: "Goal-based agents use target destinations to choose actions. Utility-based agents evaluate a trade-off metric score to maximize user satisfaction." },
      { chapter: "Unit II", repetition_count: "Repeated 5 times", priority: "High", question: "[2 Marks] State the definition of an Admissible Heuristic.", answer: "A heuristic function that never overestimates the true minimal cost to reach the targeted goal node destination." },
      { chapter: "Unit II", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Describe the A* Search algorithm step-by-step. Prove its mathematical completeness.", answer: "Uses f(n) = g(n) + h(n). Optimal and complete if h(n) is admissible." },
      { chapter: "Unit III", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Differentiate between Forward Chaining and Backward Chaining inference engines.", answer: "Forward chaining is data-driven, moving from premises to conclusions. Backward chaining is goal-driven, working backward from hypotheses." },
      { chapter: "Unit IV", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Explain the architecture of an Artificial Neural Network (ANN) and Backpropagation.", answer: "Consists of Input, Hidden, and Output layers. Backpropagation uses gradient descent to calculate error deltas and update weights backward." }
    ],
    "DATABASE MANAGEMENT SYSTEM": [
      { chapter: "Unit I", repetition_count: "Repeated 6 times", priority: "High", question: "[2 Marks] Define Data Independence.", answer: "The ability to modify schema definitions at one level without forcing alterations at subsequent higher mapping tiers." },
      { chapter: "Unit I", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Explain ER diagram notation elements. Draw an ER model for a Bank System.", answer: "Uses rectangles (entities), diamonds (relationships), ovals (attributes), and underlines (keys) to model data architecture." },
      { chapter: "Unit II", repetition_count: "Repeated 7 times", priority: "High", question: "[2 Marks] Define Referential Integrity Constraint.", answer: "A rule ensuring that a foreign key value must match an existing primary key value in the referenced parent relation." },
      { chapter: "Unit II", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Detail 3NF and BCNF normalization properties with example dependency breakdowns.", answer: "3NF eliminates transitive dependencies. BCNF requires every determinant to be a super key, fixing update anomalies." }
    ],
    "PROBABILITY AND STATISTICS": [
      { chapter: "Unit I", repetition_count: "Repeated 5 times", priority: "High", question: "[2 Marks] Define the term Skewness in statistics.", answer: "A statistical measure that quantifies the asymmetry of a probability distribution around its mean value." },
      { chapter: "Unit II", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] Obtain the two lines of regression equations for a bivariate dataset. Prove why they intersect at the means.", answer: "Equations: Y on X and X on Y. They intersect at the sample means because the least-squares derivation holds true at mean values." },
      { chapter: "Unit III", repetition_count: "Annual Pattern", priority: "High", question: "[8 Marks] State and prove Bayes' Theorem formula maps.", answer: "Formula: P(Ei|A) = [P(Ei)*P(A|Ei)] / Sum[P(Ek)*P(A|Ek)]. Proven via conditional probability breakdown equations." }
    ],
    "FEATURE ENGINEERING & CONSTITUTION": [
      { chapter: "Unit I", repetition_count: "Annual Pattern", priority: "High", question: "[10 Marks] Detail the mathematical procedures and trade-offs of Min-Max Scaling and Z-Score Normalization.", answer: "Min-Max bounds data tightly between 0 and 1. Z-Score scales data around a mean of 0 and standard deviation of 1." },
      { chapter: "Unit II", repetition_count: "Repeated 6 times", priority: "High", question: "[5 Marks] Contrast One-Hot Encoding and Label Encoding techniques.", answer: "Label encoding transforms strings into order-biased numbers. One-Hot builds separate binary flags, avoiding rank bias." },
      { chapter: "Core Rights", repetition_count: "Annual Pattern", priority: "High", question: "[10 Marks] Deeply analyze the significance and legal extensions of Article 21 (Right to Life and Personal Liberty).", answer: "Guarantees that no person shall be deprived of life or liberty except by legal procedure; protects human dignity, privacy, and health." }
    ]
  };
  useEffect(() => {
    if (showChapterGuide && dbManualData.length === 0) {
      fetch('http://localhost:8000/get-db-manual')
        .then(res => res.json())
        .then(resData => {
          if (resData.status === 'success' && resData.data.length > 0) {
            const grouped = resData.data.reduce((acc, item) => {
              const sub = item.subject.replace(/_/g, ' ').toUpperCase();
              if (!acc[sub]) acc[sub] = [];
              acc[sub].push(item);
              return acc;
            }, {});
            const entries = Object.entries(grouped);
            setDbManualData(entries);
            if (entries.length > 0) setActiveSubjectTab(entries[0][0]);
          } else {
            const entries = Object.entries(fallbackManualData);
            setDbManualData(entries);
            if (entries.length > 0) setActiveSubjectTab(entries[0][0]);
          }
        })
        .catch(err => {
          const entries = Object.entries(fallbackManualData);
          setDbManualData(entries);
          if (entries.length > 0) setActiveSubjectTab(entries[0][0]);
        });
    }
  }, [showChapterGuide]);

  const handleFileChange = (e) => { setFiles(Array.from(e.target.files)); };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) { setError('Please select at least one question paper PDF.'); return; }
    setLoading(true); setError(''); setResults(null); setSelectedChapter('ALL');
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      const response = await fetch('http://localhost:8000/analyze-papers', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to analyze papers. Check backend server.');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  const renderQuestionSection = (title, level, color, badgeBg, badgeText) => {
    let filtered = results?.important_questions?.filter(q => q.priority === level) || [];
    if (selectedChapter !== 'ALL') filtered = filtered.filter(q => q.chapter === selectedChapter);
    if (filtered.length === 0) return null;

    return (
      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ color: color, borderBottom: `2px solid ${color}`, paddingBottom: '8px', marginBottom: '20px', fontSize: '1.4rem' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filtered.map((item, index) => (
            <details key={index} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <summary style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#1a202c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ paddingRight: '15px', lineHeight: '1.4' }}>{item.question}</span>
                <span style={{ fontSize: '0.8rem', background: badgeBg, color: badgeText, padding: '5px 12px', borderRadius: '12px', whiteSpace: 'nowrap' }}>{item.repetition_count} • {item.chapter}</span>
              </summary>
              <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '6px', borderLeft: `4px solid ${color}`, cursor: 'default' }}>
                <strong style={{ color: color, display: 'block', marginBottom: '8px', fontSize: '0.95rem' }}>💡 Bangalore University Suggested Solution Scheme:</strong>
                <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6', color: '#4a5568', fontSize: '0.98rem' }}>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  };

  const uniqueChapters = results?.important_questions ? ['ALL', ...new Set(results.important_questions.map(q => q.chapter))] : [];

  return (
    <div style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#333' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px', background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: '2.6rem', color: '#1a365d', margin: '0 0 5px 0', fontWeight: '800' }}>🧠 Exam Intelligence Hub</h1>
        <div style={{ fontSize: '1.1rem', color: '#4c51bf', fontWeight: 'bold', margin: '5px 0 12px 0', letterSpacing: '0.5px' }}>
          🎓 Developed by: <span style={{ textDecoration: 'underline', color: '#2b6cb0' }}>Saniya Taj</span>
        </div>
        <p style={{ color: '#4a5568', margin: 0, fontSize: '0.98rem', lineHeight: '1.5' }}>
          Bangalore University Question Paper Pattern & High-Yield Analysis Dashboard Systems.
        </p>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          type="button"
          onClick={() => setShowChapterGuide(!showChapterGuide)}
          style={{ background: '#4c51bf', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '450px', boxShadow: '0 4px 6px rgba(76,81,191,0.2)' }}
        >
          {showChapterGuide ? '❌ Close Syllabus Manual' : '📖 View Important Qs From Each Chapter'}
        </button>
      </div>
      {showChapterGuide && (
        <div style={{ background: '#f8fafc', border: '1px solid #c3dafe', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#2c5282', textAlign: 'center' }}>🎓 Bangalore University Master Syllabus Manual</h2>
          <p style={{ textAlign: 'center', color: '#718096', margin: '0 0 20px 0', fontSize: '0.95rem' }}>Select a subject below to instantly view its chapter-wise high-yield questions:</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            {dbManualData.map(([subjectTitle], idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSubjectTab(subjectTitle)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  border: '1px solid #4c51bf',
                  cursor: 'pointer',
                  background: activeSubjectTab === subjectTitle ? '#4c51bf' : '#fff',
                  color: activeSubjectTab === subjectTitle ? '#fff' : '#4c51bf',
                  boxShadow: activeSubjectTab === subjectTitle ? '0 2px 4px rgba(76,81,191,0.3)' : 'none'
                }}
              >
                📘 {subjectTitle}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
            {dbManualData.map(([subjectTitle, questions], idx) => {
              if (subjectTitle !== activeSubjectTab) return null;
              return (
                <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ color: '#2b6cb0', marginTop: 0, borderBottom: '2px solid #cbd5e0', paddingBottom: '8px', marginBottom: '15px' }}>
                    ✍️ {subjectTitle} — High-Yield Blueprint
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {questions.map((q, qIdx) => (
                      <div key={qIdx} style={{ borderLeft: '4px solid #4c51bf', paddingLeft: '15px', background: '#f8fafc', padding: '15px', borderRadius: '0 6px 6px 0', border: '1px solid #edf2f7', borderLeftWidth: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '5px' }}>
                          <strong style={{ color: '#2d3748', fontSize: '0.95rem' }}>📌 {q.chapter} ({q.repetition_count})</strong>
                          <span style={{ fontSize: '0.75rem', background: q.priority === 'High' ? '#fed7d7' : '#e0e7ff', color: q.priority === 'High' ? '#9b2c2c' : '#3730a3', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                            {q.priority} Priority
                          </span>
                        </div>
                        <p style={{ margin: '5px 0', fontWeight: 'bold', whiteSpace: 'pre-line', fontSize: '0.95rem', color: '#1a202c', lineHeight: '1.4' }}>{q.question}</p>
                        <p style={{ margin: '8px 0 0 0', color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px dashed #e2e8f0' }}>
                          <span style={{ color: '#4c51bf', fontWeight: 'bold' }}>BU Answer Blueprint:</span> {q.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: '#f7fafc', padding: '30px', borderRadius: '12px', border: '2px dashed #cbd5e0', textAlign: 'center' }}>
        <form onSubmit={handleUpload}>
          <input type="file" multiple accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', background: '#3182ce', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>📁 Browse Question Papers</label>
          {files.length > 0 && <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#4a5568' }}><strong>Selected Files:</strong> {files.map(f => f.name).join(', ')}</div>}
          <div style={{ marginTop: '20px' }}>
            <button type="submit" disabled={loading} style={{ background: loading ? '#a0aec0' : '#48bb78', color: '#fff', padding: '12px 30px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '250px' }}>{loading ? 'Analyzing Trends...' : 'Run Paper Intelligence Analysis'}</button>
          </div>
        </form>
      </div>

      {error && <p style={{ color: '#e53e3e', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>⚠️ {error}</p>}

      {results && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ background: '#ebf8ff', borderLeft: '5px solid #3182ce', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>📈 Historical Trend Analysis Summary</h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{results.summary}</p>
          </div>

          {results.chart_data && results.chart_data.length > 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginBottom: '40px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '1.3rem' }}>📊 Chapter Weightage Distribution</h3>
              <p style={{ margin: '0 0 25px 0', color: '#718096', fontSize: '0.9rem' }}>Visual breakdown based on repeating historical marks.</p>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={results.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="topic" stroke="#4a5568" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#4a5568" tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f7fafc' }} />
                    <Bar dataKey="weight" fill="#3182ce" radius={5} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '35px', background: '#f7fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#4a5568', fontSize: '1rem' }}>📌 Filter Study Matrix Chapter-Wise:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {uniqueChapters.map((ch, idx) => (
                <button key={idx} type="button" onClick={() => setSelectedChapter(ch)} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #3182ce', cursor: 'pointer', background: selectedChapter === ch ? '#3182ce' : '#fff', color: selectedChapter === ch ? '#fff' : '#3182ce' }}>{ch === 'ALL' ? '🌍 Show All Chapters' : `📖 ${ch}`}</button>
              ))}
            </div>
          </div>

          {renderQuestionSection("🔴 1. High Importance (100% Pakka Questions)", "High", "#e53e3e", "#fed7d7", "#9b2c2c")}
          {renderQuestionSection("🟡 2. Medium Importance Questions", "Medium", "#dd6b20", "#feebc8", "#9c4221")}
          {renderQuestionSection("🟢 3. Low Importance Questions", "Low", "#38a169", "#c6f6d5", "#22543d")}
          {renderQuestionSection("📌 4. Important as per Bangalore University", "BU_Important", "#4c51bf", "#e0e7ff", "#3730a3")}
        </div>
      )}
    </div>
  );
}
