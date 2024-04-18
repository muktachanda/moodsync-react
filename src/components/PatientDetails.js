import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

function PatientDetails() {
  const { name } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${name}`);
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };
    fetchPatient();
  }, [name]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const handleChatClick = () => {
    // Navigate to the chat route for the specific patient
    navigate(`/patients/${name}/chat`);
  };

  return (
    <div className="patient-details">
      <h2>{patient.name}</h2>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
      {/* Chat icon */}
      <FontAwesomeIcon icon={faComment} className="chat-icon" onClick={handleChatClick} />
    </div>
  );
}

export default PatientDetails;
