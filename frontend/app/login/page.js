'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup modes
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin ? { username, password } : { username, email, password };

    try {
      const response = await fetch('http://localhost:8000'${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication routing operational block.');
      }

      if (isLogin) {
        setMessage('🎉 Login successful! Redirecting...');
        // Save user state locally
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to main workspace tool dashboard page
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage('✅ Account created successfully! Shifting to login screen...');
        setTimeout(() => {
          setIsLogin(true);
          setError('');
          setMessage('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', color: '#1a365d', margin: '0 0 10px 0' }}>
            {isLogin ? '🔒 Welcome Back' : '📝 Create Account'}
          </h2>
          <p style={{ color: '#718096', margin: 0 }}>
            {isLogin ? 'Sign in to access your Exam Hub' : 'Register to start analyzing papers'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#4a5568' }}>Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' }} 
              placeholder="Enter username"
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#4a5568' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' }} 
                placeholder="name@university.com"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#4a5568' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' }} 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ background: '#3182ce', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {error && <p style={{ color: '#e53e3e', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>⚠️ {error}</p>}
        {message && <p style={{ color: '#38a169', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}

        <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #edf2f7', paddingTop: '20px' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
