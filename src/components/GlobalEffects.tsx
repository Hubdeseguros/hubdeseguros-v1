
import React, { useEffect } from "react";
import { usePaymentNotifications } from "@/hooks/usePaymentNotifications";

// This component runs at the root and registers all global side effects, like payment notifications.
const GlobalEffects: React.FC = () => {
  usePaymentNotifications();
  
  // Eliminar cualquier referencia a "Listado de Clientes" del DOM
  useEffect(() => {
    // Función que se ejecutará periódicamente para eliminar elementos
    const removeClientListItems = () => {
      // 1. Buscar todos los elementos que contienen este texto
      const elements = document.querySelectorAll('a, button, li, div, span');
      
      elements.forEach(el => {
        // Comprobar si el elemento o alguno de sus hijos contiene el texto
        if (el.textContent?.includes('Listado de Clientes')) {
          // Si es un elemento de navegación, ocultarlo completamente
          if (el.tagName === 'A' || el.tagName === 'BUTTON' || 
              el.tagName === 'LI' || 
              (el.getAttribute('role') === 'menuitem') ||
              (el.classList.contains('menu-item'))) {
            el.remove(); // Eliminar completamente el elemento del DOM
          } else {
            // Para otros tipos de elementos, solo ocultarlos
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.setAttribute('aria-hidden', 'true');
            el.setAttribute('hidden', 'true');
          }
        }
        
        // Comprobar si el elemento tiene un atributo href que contenga '/clientes/listado'
        if (el.getAttribute && el.getAttribute('href') && 
            el.getAttribute('href').includes('/clientes/listado')) {
          el.remove(); // Eliminar completamente el elemento del DOM
        }
      });
      
      // Redireccionar si estamos en la página de listado de clientes
      if (window.location.pathname.includes('/clientes/listado')) {
        window.location.href = window.location.pathname.replace('/clientes/listado', '/clientes/crm');
      }
    };
    
    // Ejecutar la función inmediatamente
    removeClientListItems();
    
    // Configurar un intervalo para seguir comprobando (por si se cargan dinámicamente)
    const interval = setInterval(removeClientListItems, 1000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);
  
  return null; // No visible UI
};

export default GlobalEffects;
