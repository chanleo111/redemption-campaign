import React from 'react';
import { createRoot } from 'react-dom/client';
import { LoginForm } from './components/LoginForm';

const root = createRoot(document.getElementById('root'));
root.render(<LoginForm />);