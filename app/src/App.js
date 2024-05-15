import React, { useState} from 'react';

function App() {
  const [gameId, setGameId] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  async function startNewGame(){
    const response = await fetch('http://localhost:8080/partita', {
      method: 'POST'
    });
    const data = await response.json();
    setGameId(data.id);
    setTargetNumber(data.numero);
    setFeedback('');
    setAttempts(0);
    setGuess('');
  };
  async function handleGuess(){
    const response = await fetch(`http://localhost:8080/partita/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numero: parseInt(guess) })
    });
    setLoading(true);
    const data = await response.json();
    setAttempts(data.tentativi);
    if (data.risultato === 0) {
      setFeedback('Congratulazioni! Hai indovinato il numero!');
    } else if (data.risultato === -1) {
      setFeedback('Il numero è troppo piccolo.');
    } else {
      setFeedback('Il numero è troppo grande.');
    }
    setLoading(false);
  };


  return (
    <div>
      <h1>Indovina il numero</h1>
      {gameId ? (
        <div>
          <p>ID Partita: {gameId}</p>
          <p>Tentativi: {attempts}</p>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          {!loading ? (
            <div>
              <button onClick={handleGuess}>
                Indovina
              </button>
            </div>
          ) :(
            <div>
              <p>Caricamento...</p>
            </div>
          )}
          <p>{feedback}</p>
          <button onClick={startNewGame}>Inizia una nuova partita</button>
        </div>
      ) : (
        <div>
        <p>Clicca sul pulsante per iniziare a giocare!</p>
        <button onClick={startNewGame}>Inizia una nuova partita</button>
        </div>
      )}
    </div>
  );
}

export default App;

