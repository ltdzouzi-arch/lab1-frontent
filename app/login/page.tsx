'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<{ token?: string; user?: any; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      console.log('Login successful:');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login successful:');
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login successful:', data);
        if (data.user.role === 'doctor') {
          window.location.href = '/doctor/dashboard';
        } else {
          window.location.href = '/patient/dashboard';
        }
      } else {
        setResponse({ error: data.error });
      }
    } catch (err) {
      setResponse({ error: 'Failed to connect to authentication server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
          padding: '2.5rem 2rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(56, 189, 248, 0.2)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#38bdf8'
          }}>
            SECURE
          </div>
          
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)'
          }}>
            <span style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#0f172a' 
            }}>
              ACG
            </span>
          </div>
          
          <h1 style={{ 
            color: 'white',
            fontWeight: '700',
            fontSize: '32px',
            margin: '0 0 12px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Cybersecurity Portal
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            lineHeight: 1.5,
            maxWidth: '350px',
            margin: '0 auto'
          }}>
            Internal Network Access • Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <div style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '14px'
              }}>
                Corporate Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your corporate email"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}>
                  ✉️
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '14px'
              }}>
                Corporate Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading 
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' 
                  : 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
                marginTop: '8px'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Authenticating...
                </div>
              ) : 'Secure Login'}
            </button>
          </form>

          {/* Response Display */}
          {response && (
            <div style={{ 
              marginTop: '1.5rem',
              padding: '16px',
              background: response.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
              border: response.error ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              animation: 'fadeIn 0.3s ease'
            }}>
              {response.error ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}>
                    ⚠️
                  </div>
                  <p style={{ color: '#dc2626', margin: 0, fontWeight: '500' }}>{response.error}</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Security Notice */}
          <div style={{ 
            marginTop: '2rem',
            padding: '16px',
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: 'rgba(56, 189, 248, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                🔒
              </div>
              <span style={{ 
                fontWeight: '600', 
                color: '#38bdf8',
                fontSize: '14px'
              }}>
                Security Notice
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '13px',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              This system contains intentionally embedded vulnerabilities for 
              penetration testing purposes. All activities are logged and monitored.
            </p>
          </div>

          {/* Subtle Hint */}
          <div style={{ 
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '13px',
            color: '#94a3b8'
          }}>
            <p style={{ margin: '0' }}>ACG Internal Use Only</p>
            <p style={{ 
              margin: '8px 0 0',
              fontStyle: 'italic'
            }}>
              Standard test accounts follow corporate naming conventions
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Animation Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}