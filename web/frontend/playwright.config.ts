import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5181',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5181 --strictPort',
    env: { VITE_API_URL: 'http://127.0.0.1:8000' },
    url: 'http://127.0.0.1:5181',
    reuseExistingServer: false,
  },
})
