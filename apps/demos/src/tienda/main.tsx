import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { frameGuard } from '../shared/security';
import { TiendaApp } from './TiendaApp';
import './styles.css';

frameGuard();
createRoot(document.getElementById('root')!).render(<StrictMode><TiendaApp /></StrictMode>);
