import { useState, useEffect } from 'react';
import axios from 'axios';

function ResultsScreen({ onBack }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the smart data from the backend
        axios.get('http://localhost:5000/api/votes/results')
            .then(res => {
                setResults(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="card">Loading Results...</div>;

    return (
        <div className="card">
            {/* Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={onBack} 
                    style={{ width: 'auto', padding: '5px 15px', marginRight: '15px', marginTop: 0, backgroundColor: '#6c757d' }}
                >
                    ⬅ Subira Inyuma
                </button>
                <h2>📊 Ibivuyemo (Live Results)</h2>
            </div>

            {results.map((pos, index) => (
                <div key={index} style={{marginBottom: '30px', textAlign: 'left', border: '1px solid #eee', padding: '15px', borderRadius: '8px'}}>
                    <h3 style={{borderBottom: '2px solid #ddd', paddingBottom: '10px', marginTop: 0}}>{pos.title}</h3>
                    
                    {pos.candidates.map((cand, i) => (
                        <div key={i} style={{marginBottom: '15px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {/* Small Photo */}
                                    <img 
                                        src={cand.photo} 
                                        alt="" 
                                        style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover'}} 
                                    />
                                    <strong>{cand.name}</strong>
                                </div>
                                <span style={{fontWeight: 'bold'}}>{cand.count} votes</span>
                            </div>
                            
                            {/* The Progress Bar */}
                            <div style={{background: '#e9ecef', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
                                <div style={{
                                    background: i === 0 && cand.count > 0 ? '#28a745' : '#007bff', // Green for leader, Blue for others
                                    width: `${Math.max(cand.count * 10, 0)}%`, // Scale logic (adjust *10 based on total voters)
                                    height: '100%',
                                    transition: 'width 0.5s ease-in-out'
                                }}></div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Show message if no votes yet */}
                    {pos.candidates.every(c => c.count === 0) && (
                        <p style={{color: '#999', fontStyle: 'italic', fontSize: '0.9rem'}}>Nta majwi araboneka (No votes yet)</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ResultsScreen;