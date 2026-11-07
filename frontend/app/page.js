'use client';

import { useState } from 'react';

export default function ExamHub() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

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

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://127.0.0', {
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

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a365d', marginBottom: '10px' }}>🧠 Exam Intelligence Hub</h1>
        <p style={{ color: '#4a5568' }}>Select and cross-analyze last-year papers to extract high-yield questions and verified answers instantly.</p>
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

      {/* Analysis Results View */}
      {results && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ background: '#ebf8ff', borderLeft: '5px solid #3182ce', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>📈 Historical Trend Analysis Summary</h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{results.summary}</p>
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '20px' }}>🔑 Extracted High-Yield Questions & Solution Sets</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {results.important_questions?.map((item, index) => (
              <details key={index} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a202c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.question}</span>
                  <span style={{ fontSize: '0.8rem', background: item.priority === 'High' ? '#fed7d7' : '#feebc8', color: item.priority === 'High' ? '#9b2c2c' : '#9c4221', padding: '4px 8px', borderRadius: '12px', marginLeft: '10px' }}>
                    {item.priority} Priority • {item.repetition_count}
                  </span>
                </summary>
                <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid #48bb78', cursor: 'default' }}>
                  <strong style={{ color: '#2f855a', display: 'block', marginBottom: '8px' }}>💡 Suggested Master Answer Scheme:</strong>
                  <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6', color: '#4a5568' }}>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
