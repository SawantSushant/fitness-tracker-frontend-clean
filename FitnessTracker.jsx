import React, { useState } from 'react';

// This version uses "Enter" to submit the login form
// and ensures the login button is clickable.

const API_BASE = 'https://fitness-tracker-hgt2.onrender.com/api';

export default function FitnessTracker() {
  // ----------- STATE -----------
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);

  // ----------- FUNCTIONS -----------

  // 1) handleLogin is now used by the form "onSubmit"
  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault(); // prevent page reload on form submit
    }

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
          console.warn("⚠️ Unexpected data format:", data);
          setWorkouts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching workouts:", err);
        setWorkouts([]);
      }
    }
  };

  // 2) Add a new workout
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
      // refresh workouts
      handleLogin();
    } catch (err) {
      console.error("❌ Error adding workout:", err);
    }
  };

  // 3) Export to CSV
  const handleExportCSV = () => {
    if (!loggedInUser) return;
    window.open(`${API_BASE}/export?user=${loggedInUser}`, '_blank');
  };

  // 4) Sign out
  const handleSignOut = () => {
    setLoggedInUser(null);
    setWorkouts([]);
  };

  // ----------- RENDER -----------

  // If user is NOT logged in: show login form
  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-400 p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
          {/*
             We use <form> with onSubmit so the Enter key triggers handleLogin.
           */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  console.log("🧪 Current workouts in render:", workouts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav Bar */}
      <nav className="flex items-center justify-between bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">Fitness Tracker</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Hi, {loggedInUser}</span>
          <button
            onClick={handleSignOut}
            className="text-red-500 hover:underline"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Add Workout Section */}
        <div className="bg-white rounded-xl shadow p-6 mt-4">
          <h2 className="text-xl font-semibold mb-3">Add a Workout</h2>
          <div className="flex items-center space-x-2">
            <input
              className="flex-grow px-3 py-2 border border-gray-300 rounded"
              value={workout}
              onChange={(e) => setWorkout(e.target.value)}
              placeholder="Enter workout details (e.g. 'Pushups - 20 reps')"
            />
            <button
              onClick={handleAddWorkout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Workouts List Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Workouts</h2>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-sm"
            >
              Export to CSV
            </button>
          </div>

          {!Array.isArray(workouts) || workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map((item, index) => {
                console.log("📍 Rendering item =>", item);

                // We'll do a fallback: JSON if something is an object
                let displayWorkout = item.workout;
                if (typeof displayWorkout === 'object' && displayWorkout !== null) {
                  displayWorkout = JSON.stringify(displayWorkout);
                }

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 space-y-2"
                  >
                    <div className="font-bold text-lg">
                      Workout: {displayWorkout || 'No workout title'}
                    </div>
                    <p>
                      <span className="font-semibold">User:</span>{" "}
                      {item.user || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span>{" "}
                      {item.duration || 'N/A'} min
                    </p>
                    <p>
                      <span className="font-semibold">Calories:</span>{" "}
                      {item.calories || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Feedback:</span>{" "}
                      {item.feedback || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {item.date || 'N/A'}
                    </p>
                    {/* For debugging, show entire object */}
                    <hr />
                    <pre className="text-xs bg-gray-50 p-2 rounded">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
