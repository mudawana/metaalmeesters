import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root=document.getElementById('root');
const view=<React.StrictMode><App/></React.StrictMode>;
// Static HTML from the build is hydrated instead of replaced, for SEO and speed.
// Old bookmarked hash routes and the interactive 3D view mount independently.
if(root.dataset.ssr==='true'&&!location.hash.startsWith('#/'))hydrateRoot(root,view);
else createRoot(root).render(view);
