import React, { useState } from 'react';

const API_BASE = 'https://fitness-tracker-hgt2.onrender.com/api';

export default function FitnessTracker() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const handleLogin = async () => {
    if (username && password) {
      console.log("🔐 Logging in as:", username);
      setLoggedInUser(username);

      try {
        const res = await fetch(`${API_BASE}/workouts?user=${username}`);
        const data = await res.json();
        console.log("📦 Fetched workouts after login:", data);

        if (Array.isArray(data)) {
          setWorkouts(data);
        } else {
          console.warn("⚠️ Unexpected response format:", data);
          setWorkouts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching workouts:", err);
        setWorkouts([]);
      }
    }
  };

  const handleAddWorkout = async () => {
    if (!workout || !loggedInUser) return;

    const newWorkout = {
      user: loggedInUser,
      workout,
      duration: 30,
      calories: 250,
      feedback: "Felt good!",
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkout),
      });
      setWorkout('');
      handleLogin(); // refresh
    } catch (err) {
      console.error("❌ Error adding workout:", err);
    }
  };

  const handleExportCSV = () => {
    if (!loggedInUser) return;
    window.open(`${API_BASE}/export?user=${loggedInUser}`, '_blank');
  };

  if (!loggedInUser) {
    return (
      <div style={{ padding: '1rem' }}>
        <h1>Login</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Sign In</button>
      </div>
    );
  }

  console.log("🧪 Current workouts in render:", workouts);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome, {loggedInUser}</h1>

      <div>
        <input
          value={workout}
          onChange={(e) => setWorkout(e.target.value)}
          placeholder="Enter workout details"
        />
        <button onClick={handleAddWorkout}>Add</button>
      </div>

      <h2>Your Workouts</h2>
      {!Array.isArray(workouts) || workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <ul>
          {workouts.map((item, index) => {
            console.log("📍 Rendering item =>", item);
            return (
              <li key={index} style={{ border: '1px solid #ccc', marginTop: '0.5rem' }}>
                {JSON.stringify(item)}
              </li>
            );
          })}
        </ul>
      )}

      <button onClick={handleExportCSV} style={{ marginTop: '1rem' }}>
        Export to CSV
      </button>
    </div>
  );
}
