
// Add React import
import * as React from "react"

import ReactDOM from 'react-dom/client';
import App from './App';

// Only one import of React is necessary if using automatic runtime, but with 
// the Vite config's jsxInject, React import is already done globally, so 
// explicit import is usually not required. 
// However, if needed for types, re-enable as:
// import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

