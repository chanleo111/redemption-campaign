import React from 'react';
import { createRoot } from 'react-dom/client';
import { LoginForm } from './components/LoginForm'; // Correct path

const root = createRoot(document.getElementById('root'));
root.render(<LoginForm />);