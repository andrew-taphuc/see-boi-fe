import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  optimizeDeps: {
    // Loại bỏ face-api khỏi optimizeDeps để nó được code-split tốt hơn
    // face-api sẽ được load động khi cần (đã được implement trong faceDetection.js)
    exclude: ['@vladmandic/face-api'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách React core thành chunk riêng (thường được dùng ở mọi nơi)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Tách face-api thành chunk riêng (chỉ load khi cần nhận diện khuôn mặt)
          // Lưu ý: face-api là thư viện ML nên kích thước lớn (~1.3MB) là bình thường
          'face-api': ['@vladmandic/face-api'],
          
          // Tách Tiptap editor thành chunk riêng (chỉ load khi tạo/sửa post)
          'tiptap': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-character-count',
            '@tiptap/extension-history',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-text-align',
            '@tiptap/extension-underline',
          ],
          
          // Tách các thư viện khác thành chunks riêng
          'charts': ['recharts'],
          'socket': ['socket.io-client'],
          'utils': ['axios', 'react-markdown'],
        },
      },
    },
    // Tăng giới hạn cảnh báo lên 1500KB vì face-api là thư viện ML nên kích thước lớn là bình thường
    // face-api đã được tách riêng và chỉ load khi cần (dynamic import)
    chunkSizeWarningLimit: 1500,
  },
})
