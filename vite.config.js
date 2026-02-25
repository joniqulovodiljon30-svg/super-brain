import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env from project root (where .env.local lives)
    const env = loadEnv(mode, process.cwd(), '');
    return {
        root: 'src',
        base: '/',
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        build: {
            outDir: '../dist',
            emptyOutDir: true,
        },
        // Expose env vars to client code
        envDir: path.resolve(__dirname, '.'),
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            }
        }
    };
});
