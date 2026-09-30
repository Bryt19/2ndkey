import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // Archived (out-of-scope for v1: FHE, IPFS, document storage)
      '_archive/**',
      // Dead nested duplicate trees left over from the fork. Not imported by the app.
      'components/components/**',
      'lib/lib/**',
      'public/public/**',
      // Solidity / Hardhat project, not linted by the app config
      'contracts/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
]

export default eslintConfig
