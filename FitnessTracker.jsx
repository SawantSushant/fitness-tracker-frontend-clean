import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const API_BASE = 'https://fitness-tracker-hgt2.onrender.com/api';

export default function FitnessTracker() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]); // always an array

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
      handleLogin(); // Refresh data
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
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-2"
            />
            <Button onClick={handleLogin} className="w-full mt-4">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("🧪 Current workouts in render:", workouts); // extra debug

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {loggedInUser}</h1>

      <div className="flex items-center space-x-2">
        <Input
          value={workout}
          onChange={(e) => setWorkout(e.target.value)}
          placeholder="Enter workout details"
        />
        <Button onClick={handleAddWorkout}>Add</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Workouts</h2>

        {/* If workouts is empty or not an array */}
        {!Array.isArray(workouts) || workouts.length === 0 ? (
          <p className="text-gray-500">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {workouts.map((item, index) => {
              console.log("📍 Rendering item:", item);

              // If item is not an object, or is null, safely print as JSON
              if (typeof item !== 'object' || item === null) {
                return (
                  <li key={index} className="bg-white shadow p-4 rounded-xl text-red-600">
                    Invalid workout entry: {JSON.stringify(item)}
                  </li>
                );
              }

              // If item.workout is an object, fallback to JSON
              let displayWorkout = item.workout;
              if (typeof displayWorkout === 'object' && displayWorkout !== null) {
                displayWorkout = JSON.stringify(displayWorkout);
              }

              return (
                <li key={index} className="bg-white shadow p-4 rounded-xl">
                  <div className="font-semibold text-lg">
                    {displayWorkout || "No workout title"}
                  </div>
                  {item.duration && <p>🕒 Duration: {item.duration} min</p>}
                  {item.calories && <p>🔥 Calories: {item.calories}</p>}
                  {item.feedback && <p>💬 Feedback: {item.feedback}</p>}
                  {item.date && <p>📅 Date: {item.date}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Button onClick={handleExportCSV} className="mt-4">
        Export to CSV
      </Button>
    </div>
  );
}
