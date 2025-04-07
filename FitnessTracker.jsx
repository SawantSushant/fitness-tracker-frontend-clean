import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const API_BASE = 'https://fitness-tracker-hgt2.onrender.com/api';

export default function FitnessTracker() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const handleLogin = () => {
    if (username && password) {
      setLoggedInUser(username);
      console.log("🔐 Logged in as:", username);
      fetchWorkouts(username);
    }
  };

  const fetchWorkouts = async (user) => {
    try {
      const res = await fetch(`${API_BASE}/workouts?user=${user}`);
      const data = await res.json();
      console.log("📦 Workouts from backend:", data);
      setWorkouts(data);
    } catch (err) {
      console.error("❌ Failed to fetch workouts:", err);
    }
  };

  const handleAddWorkout = async () => {
    if (!workout || !loggedInUser) {
      console.warn("⚠️ Workout or user missing");
      return;
    }

    try {
      await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: loggedInUser, workout }),
      });
      setWorkout('');
      fetchWorkouts(loggedInUser);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent>
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mt-2" />
            <Button onClick={handleLogin} className="w-full mt-4">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {loggedInUser}</h1>

      <div className="flex items-center space-x-2">
        <Input value={workout} onChange={(e) => setWorkout(e.target.value)} placeholder="Enter workout details" />
        <Button onClick={handleAddWorkout}>Add</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Workouts</h2>

        {!Array.isArray(workouts) || workouts.length === 0 ? (
          <p className="text-gray-500">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {workouts.map((item, index) => (
              <li key={index} className="bg-white shadow p-4 rounded-xl">
                {typeof item === 'string' ? (
                  item
                ) : item.workout ? (
                  <div>
                    <strong>{item.workout}</strong>
                    {item.duration && <p>Duration: {item.duration} min</p>}
                    {item.calories && <p>Calories: {item.calories}</p>}
                    {item.date && <p>Date: {item.date}</p>}
                    {item.feedback && <p>Feedback: {item.feedback}</p>}
                  </div>
                ) : (
                  JSON.stringify(item)
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={handleExportCSV} className="mt-4">Export to CSV</Button>
    </div>
  );
}
