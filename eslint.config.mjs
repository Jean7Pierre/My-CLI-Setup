import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // Aplicar a todos los archivos TypeScript y JavaScript
  {
    files: ['**/*.{js,mjs,cjs,ts}']
  },

  // Definir el entorno de ejecución (Node.js)
  {
    languageOptions: {
      globals: globals.node
    }
  },

  // Cargar las reglas recomendadas de JavaScript y TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Tus reglas personalizadas para la CLI
  {
    rules: {
      // 1. Evita que olvides poner 'await' en funciones asincrónicas
      'no-return-await': 'error',
      // 3. Prohíbe reasignar variables que capturas en un bloque 'catch' (mantiene tus errores limpios)
      'no-ex-assign': 'error',
      // 4. Evita comparar contra un String vacío de forma insegura (ej. usar if (input === "") cuando podría ser null)
      'no-empty': ['error', { allowEmptyCatch: true }],
      // 5. Regla de TS: Obliga a usar la sintaxis moderna 'import type' si solo importas interfaces
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': 'off', // Permitido usar console.log ya que es una CLI
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error'
    }
  },

  // Archivos que quieres ignorar
  {
    ignores: ['dist/', 'node_modules/', 'coverage/']
  },

  // 2. SIEMPRE AL FINAL: Desactiva las reglas de ESLint que choquen con Prettier
  eslintConfigPrettier
]
