import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { frameGuard } from '../shared/security';
import { MenuApp } from './MenuApp';
import './styles.css';

frameGuard();
createRoot(document.getElementById('root')!).render(<StrictMode><MenuApp /></StrictMode>);
