
import ReactDOM from 'react-dom/client';
import App from './App';

// Solo una importación de React es necesaria, para evitar errores de referencia.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
