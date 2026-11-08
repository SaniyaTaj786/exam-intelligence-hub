'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ExamHub() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL'); // Tracks selected filtering state

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one question paper PDF.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setSelectedChapter('ALL'); // Reset filter upon new uploads

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8000/analyze-papers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze papers. Check your backend status.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Helper utility to render a grouped section of questions based on importance levels and active chapter filter
  const renderQuestionSection = (title, level, color, badgeBg, badgeText) => {
    let filtered = results?.important_questions?.filter(q => q.priority === level) || [];
    
    // Apply Chapter-Wise filtering constraint if a specific tab button is active
    if (selectedChapter !== 'ALL') {
      filtered = filtered.filter(q => q.chapter === selectedChapter);
    }
    
    if (filtered.length === 0) return null;

    return (
      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ color: color, borderBottom: `2px solid ${color}`, paddingBottom: '8px', marginBottom: '20px', fontSize: '1.4rem' }}>
          {title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filtered.map((item, index) => (
            <details key={index} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <summary style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#1a202c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ paddingRight: '15px', lineHeight: '1.4' }}>{item.question}</span>
                <span style={{ fontSize: '0.8rem', background: badgeBg, color: badgeText, padding: '5px 12px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                  {item.repetition_count} • {item.chapter}
                </span>
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

  // Dynamically extract all unique chapter tokens present in the backend query response payload
  const uniqueChapters = results?.important_questions 
    ? ['ALL', ...new Set(results.important_questions.map(q => q.chapter))] 
    : [];

  return (
    <div style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a365d', marginBottom: '10px' }}>🧠 Exam Intelligence Hub</h1>
        <p style={{ color: '#4a5568' }}>Bangalore University Question Paper Pattern & High-Yield Analysis Dashboard.</p>
      </header>

      {/* Upload Box */}
      <div style={{ background: '#f7fafc', padding: '30px', borderRadius: '12px', border: '2px dashed #cbd5e0', textAlign: 'center' }}>
        <form onSubmit={handleUpload}>
          <input 
            type="file" 
            multiple 
            accept=".pdf,.txt" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            id="file-upload" 
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', background: '#3182ce', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            📁 Browse Question Papers
          </label>
          {files.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#4a5568' }}>
              <strong>Selected Files:</strong> {files.map(f => f.name).join(', ')}
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ background: loading ? '#a0aec0' : '#48bb78', color: '#fff', padding: '12px 30px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '250px' }}
            >
              {loading ? 'Analyzing Trends...' : 'Run Paper Intelligence Analysis'}
            </button>
          </div>
        </form>
      </div>

      {error && <p style={{ color: '#e53e3e', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>⚠️ {error}</p>}

      {results && (
        <div style={{ marginTop: '40px' }}>
          
          {/* Trend Summary Box */}
          <div style={{ background: '#ebf8ff', borderLeft: '5px solid #3182ce', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>📈 Historical Trend Analysis Summary</h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{results.summary}</p>
          </div>

          {/* Chart Section */}
          {results.chart_data && results.chart_data.length > 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '1.3rem' }}>📊 Chapter Weightage Distribution</h3>
              <p style={{ margin: '0 0 25px 0', color: '#718096', fontSize: '0.9rem' }}>Visual breakdown of how topics are emphasized relative to each other based on repeating historical marks.</p>
              
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={results.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="topic" stroke="#4a5568" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#4a5568" tick={{ fontSize: 12 }} label={{ value: 'Weight (%)', angle: -90, position: 'insideLeft', offset: 10 }} />
                    <Tooltip cursor={{ fill: '#f7fafc' }} contentStyle={{ background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' }} />
                    <Bar dataKey="weight" fill="#3182ce" radius={5} barSize={50} name="Weight Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* NEW DYNAMIC CHAPTER-WISE SORTING BUTTONS ROW GRID */}
          <div style={{ marginBottom: '35px', background: '#f7fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#4a5568', fontSize: '1rem' }}>📌 Filter Study Matrix Chapter-Wise:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {uniqueChapters.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedChapter(ch)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    border: '1px solid #3182ce',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedChapter === ch ? '#3182ce' : '#fff',
                    color: selectedChapter === ch ? '#fff' : '#3182ce',
                  }}
                >
                  {ch === 'ALL' ? '🌍 Show All Chapters' : `📖 ${ch}`}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Section Grouped Lists Rendering Wrapper */}
          <h2 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '25px' }}>🔑 Extracted High-Yield Questions & Solution Sets</h2>
          
          {renderQuestionSection("🔴 1. High Importance (100% Pakka Questions)", "High", "#e53e3e", "#fed7d7", "#9b2c2c")}
          {renderQuestionSection("🟡 2. Medium Importance Questions", "Medium", "#dd6b20", "#feebc8", "#9c4221")}
          {renderQuestionSection("🟢 3. Low Importance Questions", "Low", "#38a169", "#c6f6d5", "#22543d")}
          {renderQuestionSection("📌 4. Important as per Bangalore University", "BU_Important", "#4c51bf", "#e0e7ff", "#3730a3")}

        </div>
      )}
    </div>
  );
}
