import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@lukeashford/aurelius$': '<rootDir>/../src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        allowJs: true,
        moduleResolution: 'node',
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@lukeashford/aurelius|lucide-react|react-player'
    + '|react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough'
    + '|remark-.*|mdast-util-.*|micromark|micromark-.*|decode-named-character-reference'
    + '|character-entities|character-entities-html4|character-entities-legacy'
    + '|character-reference-invalid|property-information|hast-util-.*'
    + '|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch'
    + '|html-void-elements|estree-util-.*|trim-lines|escape-string-regexp|ccount'
    + '|markdown-table|longest-streak|html-url-attributes|devlop|is-decimal'
    + '|is-hexadecimal|is-alphanumerical|is-alphabetical|stringify-entities|fault'
    + ')/)',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', '<rootDir>/../node_modules'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
};

export default config;
