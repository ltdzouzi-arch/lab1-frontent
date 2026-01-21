'use client';

import { useEffect, useState, useRef } from 'react';

export default function RecordsPage() {
  const [recordId, setRecordId] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Use useRef for timer to avoid closure issues
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle secret reveal through hover sequence
  useEffect(() => {
    if (isHovering) {
      // Clear any existing timer
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      
      // Set new timer
      hoverTimerRef.current = setTimeout(() => {
        setHoverCount(prev => prev + 1);
      }, 500);
    } else {
      // Clear timer when not hovering
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isHovering]);

  // Reveal secret after 7 hovers
  useEffect(() => {
    if (hoverCount >= 7) {
      setShowSecret(true);
    }
  }, [hoverCount]);

  const fetchRecord = async () => {
    if (!recordId.trim()) {
      setFileContent('⚠️ Please enter a record identifier');
      return;
    }

    setIsLoading(true);
    setFileContent('');

    try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records/${recordId}`);
      
      if (response.ok) {
        const text = await response.text();
        setFileContent(text);
      } else {
        setFileContent(`❌ Error: ${response.status} - Record not found`);
      }
    } catch (error) {
      setFileContent('❌ Failed to connect to records server');
    } finally {
      setIsLoading(false);
    }
  };

  const revealFlag = () => {
  setFileContent('Loading flag.txt...');
  setRecordId('..%2fflag.txt');
  setTimeout(() => {
    setFileContent('ACG{cl13nt_s1d3_1s_3n0ugh!}');
  }, 800);
};

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #1e293b 0%, #0f172a 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          padding: '1.5rem 0'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            📁
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ACG RECORDS VAULT
          </h1>
          <p style={{ 
            margin: '8px 0 0',
            opacity: 0.8,
            fontSize: '14px'
          }}>
            Secure Document Retrieval System • Internal Use Only
          </p>
        </header>

        {/* Main Content */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Document Identifier
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder="Enter patient ID or document path"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)'}
              />
              <button
                onClick={fetchRecord}
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  background: isLoading ? 'rgba(56, 189, 248, 0.5)' : 'linear-gradient(45deg, #38bdf8, #818cf8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? 'Loading...' : 'Retrieve'}
              </button>
            </div>
          </div>

          {/* File Content Display */}
          <div style={{
            minHeight: '200px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {fileContent || 'Document content will appear here...'}
          </div>

          {/* Hidden Secret Section */}
          {showSecret && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'linear-gradient(45deg, #ef4444, #f97316)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                🔒 CLASSIFIED
              </div>
              
              <h3 style={{ 
                margin: '0 0 12px', 
                color: '#f8fafc',
                fontSize: '18px'
              }}>
                🏁 Security Research Access
              </h3>
              <p style={{ margin: '0 0 16px', opacity: 0.9, fontSize: '14px' }}>
                You've unlocked the hidden path traversal interface. 
                The secret flag is stored in the backend directory.
              </p>
              <button
                onClick={revealFlag}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(45deg, #ef4444, #f97316)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Extract Classified Flag
              </button>
            </div>
          )}

          {/* Hover Hint */}
          {!showSecret && (
            <div 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                marginTop: '2rem',
                textAlign: 'center',
                padding: '16px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px dashed rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                cursor: 'help'
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                💡 <em>Security researchers: Hover over this area persistently</em>
              </p>
              <p style={{ 
                margin: '8px 0 0', 
                fontSize: '12px', 
                opacity: 0.6 
              }}>
                {hoverCount > 0 ? `Hover count: ${hoverCount}/7` : ''}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '12px',
          opacity: 0.6
        }}>
          ACG Cybersecurity • Internal Network • All access logged
        </div>
      </div>
    </div>
  );
}