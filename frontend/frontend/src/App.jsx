import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Dashboard from './Dashboard'
import VotingScreen from './VotingScreen'
import ResultsScreen from './ResultsScreen' // <--- IMPORT THIS

function App() {
  const [members, setMembers] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null) 
  
  // Navigation States
  const [activePosition, setActivePosition] = useState(null); 
  const [viewingResults, setViewingResults] = useState(false); // <--- NEW STATE

  // 1. Fetch Members when app loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/members')
      .then(res => {
        setMembers(res.data)
        if(res.data.length > 0) setSelectedName(res.data[0].fullName)
      })
      .catch(err => console.error("Error fetching members:", err))
  }, [])

  // 2. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        fullName: selectedName,
        pin: pin
      });
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  }

  // 3. Handle Logout
  const handleLogout = () => {
    setUser(null);
    setPin('');
    setActivePosition(null);
    setViewingResults(false);
    setError('');
  }

  // --- VIEW LOGIC ---

  // A. If NOT logged in -> Show Login Form
  if (!user) {
    return (
      <div className="card">
        <h1>🗳️ Abagwaneza Voting</h1>
        <p>Hitamo izina ryawe (Select Name)</p>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
            {members.map(member => (
              <option key={member._id} value={member.fullName}>{member.fullName}</option>
            ))}
          </select>
          <p>Andika Code wahawe (Enter PIN)</p>
          <input type="tel" maxLength="5" placeholder="Ex: 48291" value={pin} onChange={(e) => setPin(e.target.value)}/>
          <button type="submit">Injira (Login)</button>
        </form>
      </div>
    )
  }

  // B. If Viewing Results -> Show Results Screen
  if (viewingResults) {
    return <ResultsScreen onBack={() => setViewingResults(false)} />;
  }

  // C. If Voting for a position -> Show Voting Screen
  if (activePosition) {
    return (
      <VotingScreen 
        user={user}
        position={activePosition}
        onBack={() => setActivePosition(null)}
        onVoteSuccess={() => {
          setActivePosition(null); 
        }}
      />
    )
  }

  // D. Default -> Show Dashboard
  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout}
      onSelectPosition={(pos) => setActivePosition(pos)} 
      onViewResults={() => setViewingResults(true)} // <--- PASS THE FUNCTION
    />
  )
}

export default App