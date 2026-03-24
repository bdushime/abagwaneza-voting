import { useState, useEffect } from 'react';
import axios from 'axios';

function VotingScreen({ user, position, onBack, onVoteSuccess }) {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Fetch Candidates when this screen opens
    useEffect(() => {
        axios.get(`https://abagwaneza-voting.onrender.com/api/votes/candidates/${position._id}`)
            .then(res => {
                setCandidates(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [position]);

    // 2. Handle the Vote Submission
    const confirmVote = async () => {
        if (!selectedCandidate) return;
        
        // Final "Are you sure?" check
        if (!window.confirm(`Are you sure you want to vote for ${selectedCandidate.fullName}?`)) {
            return;
        }

        setSubmitting(true);

        try {
            await axios.post('https://abagwaneza-voting.onrender.com/api/votes', {
                voterId: user._id,
                position: position.title,
                candidateId: selectedCandidate._id
            });

            alert('✅ Vote Cast Successfully!');
            onVoteSuccess(); // Go back to dashboard and refresh

        } catch (err) {
            alert(err.response?.data?.message || 'Voting Failed');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="card">Loading Candidates...</div>;

    return (
        <div className="card">
            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={onBack} 
                    style={{ width: 'auto', padding: '5px 15px', marginRight: '15px', marginTop: 0 }}
                >
                    ⬅ Inyuma (Back)
                </button>
                <h2>Tora: {position.title}</h2>
            </div>

            <p>Hitamo umukandida umwe (Select one candidate):</p>

            {/* Candidate List */}
            <div className="candidate-grid">
                {candidates.map(candidate => (
                    <div 
                        key={candidate._id} 
                        className={`candidate-card ${selectedCandidate?._id === candidate._id ? 'selected' : ''}`}
                        onClick={() => setSelectedCandidate(candidate)}
                    >
                        {/* Circle Image */}
                        <div className="candidate-photo">
                            {/* Uses first letter of name if no photo */}
                            <img src={candidate.photoUrl} alt={candidate.fullName} />
                        </div>
                        <h3>{candidate.fullName}</h3>
                        
                        {/* Checkmark circle */}
                        <div className="radio-circle">
                            {selectedCandidate?._id === candidate._id && "✔"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Button (Only shows when someone is selected) */}
            {selectedCandidate && (
                <div style={{ marginTop: '20px' }}>
                    <p>Wahisemo: <strong>{selectedCandidate.fullName}</strong></p>
                    <button 
                        onClick={confirmVote} 
                        disabled={submitting}
                        style={{ backgroundColor: '#28a745' }} // Green button
                    >
                        {submitting ? 'Sending...' : 'Emeza Ijwi (Confirm Vote)'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default VotingScreen;