'use client';

import { useEffect, useState } from 'react';

export default function PatientDashboard() {
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '124',
    date: '',
    notes: ''
  });

  // Check if user is logged in as patient
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'patient') {
        alert('⚠️ Access Denied: Patient access only');
        window.location.href = '/login';
        return;
      }
      setCurrentUser(user);
      
      // Load patient's own data
      loadPatientData(user.id);
    } catch (e) {
      window.location.href = '/login';
    }
  }, []);

  const loadPatientData = async (patientId: string) => {
    try {
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
        setError('Failed to load your medical records');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const createAppointment = async () => {
    if (!newAppointment.date) {
      setError('Please select an appointment date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: currentUser?.id,
          doctorId: newAppointment.doctorId,
          date: newAppointment.date,
          notes: newAppointment.notes
        })
      });

      if (res.ok) {
        const appointment = await res.json();
        alert(`✅ Appointment scheduled! ID: ${appointment.id}`);
        // Refresh patient data to show new appointment
        if (currentUser) loadPatientData(currentUser.id);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAppointment({ ...newAppointment, date: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewAppointment({ ...newAppointment, notes: e.target.value });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem 0'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                ACG
              </div>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  color: '#0f172a', 
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  Cybersecurity Portal
                </h1>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  Patient Dashboard • Internal Network
                </p>
              </div>
            </div>
          </div>
          
          {currentUser && (
            <div style={{
              background: '#f1f5f9',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1'
            }}>
              <span style={{ 
                color: '#334155', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {currentUser.email}
              </span>
              <span style={{ 
                marginLeft: '8px',
                background: '#dcfce7',
                color: '#166534',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                PATIENT
              </span>
            </div>
          )}
        </header>

        {error && (
          <div style={{ 
            marginBottom: '1.5rem',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {!patientData ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
            <p>Loading your medical records...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Medical Records */}
            <div style={{ 
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  📋 Your Medical Records
                </h2>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>
                    <strong>Name:</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                    {patientData.name}
                  </p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>
                    <strong>Patient ID:</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                    {patientData.id}
                  </p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>
                    <strong>Medical History:</strong>
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginTop: '4px'
                  }}>
                    {patientData.medicalHistory?.map((condition: string, index: number) => (
                      <span 
                        key={index}
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>
                    <strong>Prescriptions:</strong>
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginTop: '4px'
                  }}>
                    {patientData.prescriptions?.map((med: string, index: number) => (
                      <span 
                        key={index}
                        style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {med}
                      </span>
                    )) || (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        No prescriptions recorded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Appointment */}
            <div style={{ 
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  📅 Schedule Appointment
                </h2>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '14px'
                  }}>
                    Doctor
                  </label>
                  <select
                    value={newAppointment.doctorId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="124">Dr. Smith</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '14px'
                  }}>
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newAppointment.date}
                    onChange={handleDateChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '14px'
                  }}>
                    Notes (Symptoms, Concerns)
                  </label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={handleNotesChange}
                    placeholder="Describe your symptoms or concerns..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button
                  onClick={createAppointment}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}