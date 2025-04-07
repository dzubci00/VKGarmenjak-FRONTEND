import React from 'react';
import ReactDOM from 'react-dom/client'; // Koristi 'react-dom/client' umesto 'react-dom'

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Kreiraš root
root.render(<App />); // Renderuješ aplikaciju
