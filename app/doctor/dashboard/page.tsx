'use client';

import { useEffect, useState, useRef } from 'react';

export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState('123');
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  // Appointment states
  const [appointmentId, setAppointmentId] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [appointmentError, setAppointmentError] = useState('');
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Konami sequence (hidden from users)
  const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication and role
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'doctor') {
        alert('⚠️ Access Denied: Doctor privileges required');
        window.location.href = '/login';
        return;
      }
      setCurrentUser(user);
      
      loadAllAppointments();
    } catch (e) {
      window.location.href = '/login';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        key = e.key;
      } 
      else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        key = e.key.toLowerCase();
      }
      else {
        return;
      }

      const newSequence = [...inputSequence, key].slice(-10);
      setInputSequence(newSequence);
      
      if (newSequence.join(',') === KONAMI_SEQUENCE.join(',')) {
        setShowHints(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence]);

  // Handle click counter (40 clicks required)
  const handleACGClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 40) {
      setShowHints(true);
    }
  };

  const loadAllAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const appointments = await res.json();
        setAllAppointments(Array.isArray(appointments) ? appointments : []);
      } else {
        setAllAppointments([]);
      }
    } catch (err) {
      setAllAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const viewPatientRecord = async () => {
    if (!patientId.trim()) {
      setError('Please enter a valid patient ID');
      return;
    }

    try {
      setError('');
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPatientData(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Patient record not found');
        setPatientData(null);
      }
    } catch (err) {
      setError('Failed to connect to patient records server');
      setPatientData(null);
    }
  };

  const viewAppointment = async (id?: string) => {
    const targetId = id || appointmentId;
    if (!targetId.trim()) {
      setAppointmentError('Please select or enter an appointment ID');
      return;
    }

    try {
      setAppointmentError('');
      setAppointmentId(targetId);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${targetId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentAppointment(data);
      } else {
        setAppointmentError('Appointment not found');
        setCurrentAppointment(null);
      }
    } catch (err) {
      setAppointmentError('Failed to load appointment');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      viewPatientRecord();
    }
  };

  const handleAppointmentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      viewAppointment();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div 
                onClick={handleACGClick}
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  boxShadow: '0 8px 20px rgba(56, 189, 248, 0.4)'
                }}
                title={`Click me ${40 - clickCount} more times for developer access`}
              >
                ACG
              </div>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Cybersecurity Portal
                </h1>
                <p style={{ 
                  margin: '8px 0 0',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px'
                }}>
                  Doctor Dashboard • Internal Network
                </p>
              </div>
            </div>
          </div>
          
          {currentUser && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ 
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {currentUser.email}
                </span>
                <span style={{ 
                  marginLeft: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  color: '#0f172a',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  DOCTOR
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Patient Record Viewer */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
              padding: '2rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🔍
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>
                    Patient Record Lookup
                  </h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                    Access medical records via patient ID (IDOR vulnerability)
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '16px'
                  }}>
                    Patient ID
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter patient ID (e.g., 123)"
                      style={{
                        flex: 1,
                        padding: '14px 18px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#334155'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button
                      onClick={viewPatientRecord}
                      style={{
                        padding: '14px 28px',
                        background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(51, 65, 85, 0.3)'
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ 
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ⚠️
                  </div>
                  {error}
                </div>
              )}

              {patientData && (
                <div style={{ 
                  marginTop: '24px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'white'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '20px',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0f172a',
                        fontWeight: 'bold',
                        fontSize: '20px'
                      }}>
                        👤
                      </div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#0f172a',
                        fontSize: '22px',
                        fontWeight: '700'
                      }}>
                        Patient Record: {patientData.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                      <div>
                        <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                          EMAIL ADDRESS
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                          {patientData.email}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                          PATIENT ID
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                          {patientData.id}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                          SOCIAL SECURITY NUMBER
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#dc2626' }}>
                          {patientData.ssn}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                          USER ROLE
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                          {patientData.role || 'patient'}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '32px' }}>
                      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '16px', fontWeight: '600' }}>
                        MEDICAL HISTORY
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '12px' 
                      }}>
                        {patientData.medicalHistory?.map((condition: string, index: number) => (
                          <span 
                            key={index}
                            style={{
                              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                              color: '#1d4ed8',
                              padding: '8px 16px',
                              borderRadius: '24px',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: '1px solid rgba(219, 234, 254, 0.5)'
                            }}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '24px' }}>
                      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '16px', fontWeight: '600' }}>
                        PRESCRIPTIONS
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '12px' 
                      }}>
                        {patientData.prescriptions?.map((med: string, index: number) => (
                          <span 
                            key={index}
                            style={{
                              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                              color: '#166534',
                              padding: '8px 16px',
                              borderRadius: '24px',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: '1px solid rgba(220, 252, 231, 0.5)'
                            }}
                          >
                            {med}
                          </span>
                        )) || (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>
                            No prescriptions recorded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!patientData && !error && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
                  <p style={{ fontSize: '18px', fontWeight: '500' }}>Enter a patient ID to view medical records</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Viewer with Dropdown */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              padding: '2rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📅
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>
                    Patient Appointments
                  </h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                    View appointments (Stored XSS vulnerability demonstration)
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2rem' }}>
              {/* Dropdown for all appointments */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  fontSize: '16px'
                }}>
                  Select Appointment
                </label>
                
                {loadingAppointments ? (
                  <div style={{ 
                    padding: '16px', 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(100, 116, 139, 0.3)',
                      borderTop: '2px solid #64748b',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Loading appointments...
                  </div>
                ) : allAppointments.length > 0 ? (
                  <select
                    value={appointmentId}
                    onChange={(e) => viewAppointment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">-- Choose an appointment --</option>
                    {allAppointments.map((appt) => (
                      <option key={appt.id} value={appt.id}>
                        ID: {appt.id} | Patient: {appt.patientId} | {new Date(appt.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ 
                    padding: '16px', 
                    color: '#dc2626', 
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    No appointments found. Patients need to schedule appointments first.
                  </div>
                )}
              </div>

              {/* Manual ID input as fallback */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '16px'
                  }}>
                    Or Enter Appointment ID Manually
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={appointmentId}
                      onChange={(e) => setAppointmentId(e.target.value)}
                      onKeyPress={handleAppointmentKeyPress}
                      placeholder="Enter appointment ID"
                      style={{
                        flex: 1,
                        padding: '14px 18px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button
                      onClick={() => viewAppointment()}
                      style={{
                        padding: '14px 28px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {appointmentError && (
                <div style={{ 
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ⚠️
                  </div>
                  {appointmentError}
                </div>
              )}

              {currentAppointment && (
                <div style={{ 
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px'
                    }}>
                      📝
                    </div>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '700' }}>
                      Appointment Details
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                        PATIENT ID
                      </p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                        {currentAppointment.patientId}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                        DOCTOR ID
                      </p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                        {currentAppointment.doctorId}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                        APPOINTMENT DATE
                      </p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#1e293b' }}>
                        {new Date(currentAppointment.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '16px', fontWeight: '600' }}>
                      APPOINTMENT NOTES
                    </p>
                    <div style={{ 
                      padding: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      minHeight: '80px'
                    }}>
                      {/* ⚠️ DANGEROUS: This is where XSS executes! */}
                      <div dangerouslySetInnerHTML={{ __html: currentAppointment.notes }} />
                    </div>
                  </div>
                </div>
              )}

              {!currentAppointment && !appointmentError && allAppointments.length === 0 && !loadingAppointments && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '24px' }}>📅</div>
                  <p style={{ fontSize: '18px', fontWeight: '500' }}>No appointments scheduled yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Hints Section */}
        {showHints && (
          <>
            {/* Security Vulnerability Panel */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                padding: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ⚠️
                  </div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>
                    Security Researcher Mode Activated
                  </h2>
                </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <h3 style={{ 
                  margin: '0 0 20px', 
                  color: '#0f172a',
                  fontSize: '22px',
                  fontWeight: '700'
                }}>
                  Hidden Vulnerability Assessment Tools
                </h3>
                
                <p style={{ 
                  margin: '0 0 24px', 
                  color: '#64748b',
                  lineHeight: 1.6,
                  fontSize: '16px'
                }}>
                  You've unlocked developer mode! This interface reveals critical security flaws 
                  intentionally embedded for penetration testing purposes.
                </p>
                
                <div style={{ 
                  background: 'rgba(251, 207, 64, 0.1)',
                  border: '1px solid rgba(251, 207, 64, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#854d0e', fontSize: '16px' }}>
                    🔍 Assessment Guidance:
                  </p>
                  <ul style={{ 
                    margin: '0',
                    paddingLeft: '24px',
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: '16px'
                  }}>
                    <li>Test patient record access with different IDs</li>
                    <li>Look for sensitive data exposure (SSN, medical history)</li>
                    <li>Document all findings for ACG Cybersecurity team</li>
                  </ul>
                </div>
                
                <div style={{ 
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#166534', fontSize: '16px' }}>
                    🛡️ ACG Internal Use Only
                  </p>
                  <p style={{ 
                    margin: '0', 
                    color: '#64748b',
                    fontSize: '16px'
                  }}>
                    This vulnerability assessment environment is authorized for 
                    ACG Cybersecurity personnel only. All activities are logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Patient Access */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 20px', 
                color: '#0f172a',
                fontSize: '22px',
                fontWeight: '700'
              }}>
                🚀 Quick Patient Access (Research Mode)
              </h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {['123', '124'].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setPatientId(id);
                      viewPatientRecord();
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      color: '#334155',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Patient {id}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Subtle Hint */}
        {!showHints && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px'
          }}>
            <p>🔍 <em>Security researchers: There are two ways to unlock hidden assessment tools...</em></p>
            <p style={{ marginTop: '12px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Tip: One method involves classic gaming culture "konami code", the other requires patience and persistence clicking the ACG logo.
            </p>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}