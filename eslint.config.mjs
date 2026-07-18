import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const architectureRestrictions = {
  domain: [
    '**/application/**',
    '**/infrastructure/**',
    '**/presentation/**',
    '**/main/**',
    '**/preload/**',
    '**/renderer/**',
  ],
  renderer: [
    'electron',
    'electron/*',
    'node:*',
    '**/main/**',
    '**/preload/**',
    '**/infrastructure/**',
  ],
};

export default tseslint.config(
  {
    ignores: [
      '.vite/**',
      'coverage/**',
      'DOCUMENTACAO/**',
      'node_modules/**',
      'out/**',
      'package-lock.json',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['src/**/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: architectureRestrictions.domain },
      ],
    },
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.flat['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,
      'no-restricted-imports': [
        'error',
        { patterns: architectureRestrictions.renderer },
      ],
    },
  },
);
