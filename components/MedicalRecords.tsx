import React from 'react';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: string[];
  visitDate: string;
  notes: string;
  sensitive: boolean;
}

interface MedicalRecordsProps {
  patientId: string;
  showSensitive?: boolean;
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = async ({ 
  patientId,
  showSensitive = false 
}) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // ❌ VULNERABLE: Direct database query without authorization check
  // This is simulating fetching from a database
  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: 'rec001',
      patientId: '123',
      patientName: 'John Doe',
      diagnosis: 'Hypertension Stage 1',
      medications: ['Lisinopril 10mg', 'Hydrochlorothiazide 25mg'],
      visitDate: '2024-01-15',
      notes: 'Patient responding well to medication. BP 130/85.',
      sensitive: false
    },
    {
      id: 'rec002',
      patientId: '123',
      patientName: 'John Doe',
      diagnosis: 'Anxiety Disorder',
      medications: ['Sertraline 50mg', 'Alprazolam 0.25mg PRN'],
      visitDate: '2024-01-10',
      notes: 'Patient reports decreased anxiety symptoms. Continue current regimen.',
      sensitive: true
    },
    {
      id: 'rec003',
      patientId: '456',
      patientName: 'Jane Smith',
      diagnosis: 'Type 2 Diabetes',
      medications: ['Metformin 1000mg', 'Glipizide 5mg'],
      visitDate: '2024-01-12',
      notes: 'A1C improved from 8.2% to 7.1%. Good progress.',
      sensitive: false
    },
    {
      id: 'rec004',
      patientId: '456',
      patientName: 'Jane Smith',
      diagnosis: 'HIV Positive',
      medications: ['Biktarvy', 'Dolutegravir'],
      visitDate: '2024-01-05',
      notes: 'Viral load undetectable. CD4 count 650.',
      sensitive: true
    },
    {
      id: 'rec005',
      patientId: '789',
      patientName: 'Bob Johnson',
      diagnosis: 'Coronary Artery Disease',
      medications: ['Atorvastatin 40mg', 'Clopidogrel 75mg', 'Aspirin 81mg'],
      visitDate: '2024-01-08',
      notes: 'Stable condition. No chest pain reported.',
      sensitive: false
    }
  ];

  // Filter by patientId (VULNERABLE - anyone can see any patient's records)
  const patientRecords = mockMedicalRecords.filter(record => 
    record.patientId === patientId
  );

  // Filter out sensitive records unless explicitly allowed
  const visibleRecords = showSensitive 
    ? patientRecords 
    : patientRecords.filter(record => !record.sensitive);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Medical Records for Patient ID: <span className="text-blue-600">{patientId}</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Total records: {patientRecords.length} 
          {!showSensitive && patientRecords.some(r => r.sensitive) && 
            ` (${patientRecords.filter(r => r.sensitive).length} sensitive records hidden)`
          }
        </p>
      </div>

      {visibleRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No medical records found for this patient.</p>
          {patientRecords.some(r => r.sensitive) && !showSensitive && (
            <p className="text-sm mt-2">Some records may be marked as sensitive and hidden.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleRecords.map((record) => (
            <div 
              key={record.id}
              className={`p-4 border rounded-lg ${record.sensitive ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{record.diagnosis}</h3>
                  <p className="text-sm text-gray-600">
                    Patient: {record.patientName} ({record.patientId})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{record.visitDate}</span>
                  {record.sensitive && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Sensitive
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700">Medications:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {record.medications.map((med, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700">Notes:</h4>
                <p className="text-gray-600 mt-1">{record.notes}</p>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 border-t pt-2">
                Record ID: {record.id} | Retrieved at: {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vulnerability demonstration note */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Security Notice</h3>
        <p className="text-yellow-700 text-sm">
          This page demonstrates an <strong>IDOR vulnerability</strong>. Any doctor can access any patient's records 
          by simply changing the <code>patientId</code> parameter in the URL. Try changing it to "456" or "789".
        </p>
      </div>
    </div>
  );
};