import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import FitnessTracker from './FitnessTracker.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<FitnessTracker />);
