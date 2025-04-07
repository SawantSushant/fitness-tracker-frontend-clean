import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function FitnessTracker() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = () => {
    if (username && password) {
      setLoggedInUser(username);
    }
  };

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent>
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button onClick={handleLogin} className="w-full mt-2">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Welcome, {loggedInUser}</h1>
    </div>
  );
}
