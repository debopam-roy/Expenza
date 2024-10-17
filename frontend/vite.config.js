import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: ['path', 'fs', 'url', 'source-map-js'], // Add any other Node.js modules you don't want to bundle
        },
    },
});
