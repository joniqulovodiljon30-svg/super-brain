import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        root: 'src',
        base: '/',
        plugins: [
            react(),
        ],
        build: {
            outDir: '../dist',
            emptyOutDir: true,
        },
        define: {
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "")
        }
    };
});
