import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error boundary for rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  const errorMsg = "Root element not found. Make sure there's a <div id='root'></div> in your HTML.";
  console.error(errorMsg);
  document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif;"><h1>Error</h1><p>${errorMsg}</p></div>`;
  throw new Error(errorMsg);
}

// Enhanced error handling for production
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error source:', event.filename, 'at line', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Check for environment variables (log in both dev and prod for debugging)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase environment variables are missing. Some features may not work.");
  console.warn("Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file");
}

// Wrap render in try-catch for better error handling
try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif; text-align: center;">
      <h1 style="color: #dc2626;">Application Error</h1>
      <p style="color: #6b7280; margin-top: 16px;">Failed to initialize the application.</p>
      <p style="color: #9ca3af; margin-top: 8px; font-size: 14px;">Check the browser console for more details.</p>
      <button onclick="window.location.reload()" style="margin-top: 24px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
  throw error;
}
