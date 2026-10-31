import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

// Keep Vite's source HTML separate from the compiled index.html at the
// repository root. GitHub Pages was also publishing main as legacy Jekyll,
// which otherwise exposes /src/main.jsx and causes a blank screen.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-source-index-in-dev',
      configureServer(server) {
        server.middlewares.use((req,_res,next)=>{
          if (req.url === '/' || req.url === '/index.html') {
            req.url='/site.source.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: resolve(process.cwd(),'site.source.html')
    }
  },
  base: process.env.GITHUB_PAGES === 'true' ? '/metaalmeesters/' : '/'
});
