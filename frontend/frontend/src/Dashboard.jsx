import { useState, useEffect } from 'react';
import axios from 'axios';

// Update Props to include 'onViewResults'
function Dashboard({ user, onLogout, onSelectPosition, onViewResults }) {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch positions and voting status
    useEffect(() => {
        axios.get(`http://localhost:5000/api/votes/dashboard/${user._id}`)
            .then(res => {
                setPositions(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [user]);

    if (loading) return <div className="card">Loading...</div>;

    return (
        <div className="card">
            {/* Header with Logout */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <h2>🗳️ Amatora</h2>
                <button 
                    onClick={onLogout} 
                    style={{width: 'auto', padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#666', marginTop: 0}}
                >
                    Sohoka (Logout)
                </button>
            </div>
            
            <p>Murakaza neza, <strong>{user.fullName}</strong>.</p>
            
            {/* NEW: View Results Button */}
            <button 
                onClick={onViewResults} 
                style={{backgroundColor: '#6c757d', marginBottom: '20px'}}
            >
                📊 Reba Ibivuyemo (View Results)
            </button>

            <p>Hitamo umwanya utore (Select a position):</p>

            {/* Position List */}
            <div className="position-list">
                {positions.map(pos => (
                    <div 
                        key={pos._id} 
                        className={`position-card ${pos.hasVoted ? 'voted' : ''}`}
                        onClick={() => !pos.hasVoted && onSelectPosition(pos)}
                    >
                        <div className="pos-info">
                            <h3>{pos.title}</h3>
                            <span className="status">
                                {pos.hasVoted ? '✅ Wamaze gutora' : '🔴 Tora'}
                            </span>
                        </div>
                        {!pos.hasVoted && <span className="arrow">👉</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;