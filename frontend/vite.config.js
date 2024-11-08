import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load từ file public.env
dotenv.config({ path: './public.env' });

export default defineConfig({
  plugins: [react()],
  // các cấu hình khác
});
