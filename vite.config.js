import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'



export default defineConfig({
  plugins: [sveltekit(), Icons({
    compiler: 'svelte',
  })],
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['svelte/compiler']
  },
  build: {
    rollupOptions: {
      external: ['electron']
    }
  },
  define: {
    'process.env': {}
  }
});