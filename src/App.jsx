import React, { useState, useEffect } from 'react';

// Vintage/Emotional Color swatches similar to the Unsent Project
const COLOR_OPTIONS = [
  { label: 'Blue (Sadness)', value: '#a0c4ff' },
  { label: 'Red (Anger/Passion)', value: '#ffadad' },
  { label: 'Yellow (Jealousy)', value: '#fdffb6' },
  { label: 'Green (Growth/Regret)', value: '#caffbf' },
  { label: 'Purple (Unrequited)', value: '#bdb2ff' }
];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [emotion, setEmotion] = useState('');
  const [color, setColor] = useState('#a0c4ff');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await window.api.getEntries();
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await window.api.addEntry({
      recipient,
      message,
      emotion,
      color,
      tags: ''
    });

    setRecipient('');
    setMessage('');
    setEmotion('');
    loadEntries();
  };

  const handleDelete = async (id) => {
    await window.api.deleteEntry(id);
    loadEntries();
  };

  return (
    <div className="app-container">
      <header>
        <h1>UNSPOKEN // Unsent Archive</h1>
        <div>Local-First Storage</div>
      </header>

      <main className="main-content">
        {/* Left Side: Creation */}
        <form className="composer-panel" onSubmit={handleSubmit}>
          <h3>Write a Letter</h3>
          <input 
            type="text" 
            placeholder="To (First Name/Initial)" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)} 
          />
          <textarea 
            rows="6" 
            placeholder="Type your unsent message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Emotion tag (e.g. Heartbreak)" 
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)} 
          />
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {COLOR_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button type="submit">Submit to Wall</button>
        </form>

        {/* Right Side: The Digital Grid Wall */}
        <section className="wall-panel">
          <div className="letter-grid">
            {entries.map((letter) => (
              <div 
                key={letter.id} 
                className="letter-card" 
                style={{ backgroundColor: letter.color || '#fff' }}
              >
                <div>
                  <div className="card-recipient">To: {letter.recipient_name || 'Anonymous'}</div>
                  <div className="card-body">"{letter.message}"</div>
                </div>
                <div className="card-footer">
                  <span>{letter.emotion || 'Unspoken'}</span>
                  <button className="delete-btn" onClick={() => handleDelete(letter.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}