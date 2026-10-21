import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Compiler rule added in eslint-plugin-react-hooks v6. The existing
      // motion/media-query hooks read browser-only state (matchMedia,
      // reduced-motion, sessionStorage) once on mount, which this rule flags.
      // Kept visible as a warning until those hooks move to useSyncExternalStore.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
])
