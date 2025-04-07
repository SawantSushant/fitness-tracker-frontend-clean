import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <-- Import the file with @tailwind directives

import FitnessTracker from './FitnessTracker.jsx';

createRoot(document.getElementById('root')).render(<FitnessTracker />);
