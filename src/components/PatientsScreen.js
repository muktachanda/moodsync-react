import React, { useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom'; // Remove BrowserRouter alias
import axios from 'axios';
import '../App.css';

function PatientDetails({ patient }) {
  return (
    <div className="patient-details">
      <h2>{patient.name}</h2>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
    </div>
  );
}

function App() {
  const [patients, setPatients] = useState([]);

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="app">
      <div className="patient-grid">
        {patients.map((patient, index) => (
          <Link
            key={index}
            to={`/patients/${patient.name}`}
            className="patient-item"
            style={{
              width: '30vw', // Occupies half the width of the screen
              height: '30vw', // Same height as width
            }}
          >
            <h2>{patient.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default App;
