'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('curl http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email":"patient1@test.com","password":"password"}\'');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: '"Segoe UI", system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '2rem 2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '24px'
            }}>
              ACG
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                Vulnerable Telemedicine Lab
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '14px' }}>
                Internal Security Assessment Environment
              </p>
            </div>
          </div>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🔒 AUTHORIZED PERSONNEL ONLY
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '24px',
            background: 'linear-gradient(45deg, #38bdf8, #818cf8, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            ⚠️
          </div>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 16px',
            background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SECURITY LAB ENVIRONMENT
          </h2>
          <p style={{
            fontSize: '20px',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            This application contains intentionally embedded vulnerabilities for penetration testing and security research purposes.
          </p>
        </div>

        {/* Vulnerability Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '3rem'
        }}>
          {/* Authentication */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '16px',
              color: '#f8fafc'
            }}>🔐</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Broken Authentication
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: 1.5 }}>
              Weak credentials, no rate limiting, verbose errors, and fake JWT tokens enable account takeover.
            </p>
          </div>

          {/* IDOR */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '16px',
              color: '#f8fafc'
            }}>👁️</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Insecure Direct Object Reference
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: 1.5 }}>
              Doctors can access any patient's sensitive medical records including SSN and medical history.
            </p>
          </div>

          {/* XSS */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '16px',
              color: '#f8fafc'
            }}>💉</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Stored Cross-Site Scripting
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: 1.5 }}>
              Patient appointment notes execute arbitrary JavaScript in doctor's browser, enabling session hijacking.
            </p>
          </div>

          {/* Path Traversal */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '16px',
              color: '#f8fafc'
            }}>📁</div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Path Traversal
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: 1.5 }}>
              Arbitrary file read vulnerability allows extraction of secret flags and system files.
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '600' }}>
            🔍 Quick Access Points
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a 
              href="/login" 
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Login Portal
            </a>
            <a 
              href="/records" 
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Records Vault
            </a>
          </div>
        </div>

        {/* API Testing */}
        <div style={{
          marginTop: '3rem',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: '600' }}>
            🧪 Test Credentials & API
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#38bdf8' }}>
                Patient Account
              </p>
              <p style={{ margin: '0 0 16px', fontSize: '14px', opacity: 0.9 }}>
                <strong>Email:</strong> patient1@test.com<br/>
              </p>
              <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#38bdf8' }}>
                Doctor Account
              </p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                <strong>Email:</strong> doctor1@test.com<br/>
              </p>
            </div>
            <div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflowX: 'auto'
              }}>
                {`curl http://localhost:3001/api/auth/login`}
                <br/>
                {`  -H "Content-Type: application/json"`}
                <br/>
                {`  -d '{"email":"patient1@test.com","password":"password123"}'`}
              </div>
              <button
                onClick={copyCommand}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {copied ? '✓ Copied!' : 'Copy cURL Command'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          fontSize: '14px',
          opacity: 0.7
        }}>
          <p style={{ margin: '0 0 8px' }}>
            ACG Cybersecurity • Internal Vulnerability Assessment Lab
          </p>
          <p style={{ margin: 0 }}>
            All activities are logged and monitored • Unauthorized access prohibited
          </p>
        </div>
      </div>
    </div>
  );
}