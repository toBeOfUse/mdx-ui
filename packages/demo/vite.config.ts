import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const base = isGitHubPages && repo ? `/${repo}/` : '/';

  return {
    base,
    plugins: [mdx(), react()],
  };
})
