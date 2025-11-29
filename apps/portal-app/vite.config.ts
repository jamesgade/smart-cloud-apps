/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/portal-app',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/portal-app',
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: 'esbuild' as const, // Use esbuild for faster builds
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Increase chunk size warning limit to avoid false warnings
    chunkSizeWarningLimit: 1000,
    // Ensure proper module resolution
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        // Minimal chunking to avoid circular dependency issues
        // Only split truly independent libraries
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            return;
          }
          
          // React - completely independent, safe to split
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // Refine - independent library, safe to split
          if (id.includes('node_modules/@refinedev')) {
            return 'refine-vendor';
          }
          
          // Keep EVERYTHING else in one vendor chunk
          // This includes MUI, Emotion, React Router, and all other dependencies
          // This prevents any circular dependency issues between chunks
          return 'vendor';
        },
      },
    },
    // Enable source maps for production debugging (optional - can disable for smaller builds)
    sourcemap: false,
  },
}));
