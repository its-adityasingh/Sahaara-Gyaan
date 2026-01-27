import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for production builds (empty string means root)
  base: '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit (default is 500KB)
    // This is useful for large dependencies like recharts, supabase, etc.
    chunkSizeWarningLimit: 1000,
    
    // Ensure proper output directory
    outDir: 'dist',
    
    // Optimize chunk splitting for better caching and loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'chart-vendor': ['recharts'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    
    // Optimize for production
    minify: 'esbuild',
    sourcemap: false,
    
    // Increase build target for better optimization
    target: 'esnext',
    
    // Ensure assets are properly referenced
    assetsDir: 'assets',
  },
  
  // Ensure proper handling of environment variables
  define: {
    'import.meta.env.DEV': JSON.stringify(mode === 'development'),
    'import.meta.env.PROD': JSON.stringify(mode === 'production'),
  },
}));
