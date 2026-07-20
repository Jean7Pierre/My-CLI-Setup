export const prettierrc = JSON.stringify(
  {
    singleQuote: true,
    semi: false,
    printWidth: 110,
    tabWidth: 2,
    useTabs: false,
    trailingComma: 'none',
    bracketSpacing: true,
    bracketSameLine: false,
    jsxSingleQuote: false,
    arrowParens: 'always'
  },
  null,
  2
)

export const prettierignore = `
# Carpetas de dependencias y compilación (Vite)
node_modules
dist
build

# Ignore artifacts:
build
coverage

# Archivos de bloqueo de paquetes (pnpm)
pnpm-lock.yaml
package-lock.json
yarn.lock

# Archivos de variables de entorno (por seguridad y formato)
.env
.env.*

# Logs y archivos temporales de errores
*.log
.eslintcache

# Archivos multimedia y binarios (Prettier no puede ni debe procesarlos)
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.mp4
*.pdf
*.woff
*.woff2
*.eot
*.ttf
*.md`

export const eslintConfig = `
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(
  // 1. Archivos ignorados
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs']
  },

  // 2. Reglas base de JS y TS
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Entorno y configuración del analizador para React
  {
    languageOptions: {
      // Le decimos a ESLint que estamos en un navegador moderno
      globals: {
        ...globals.browser,
        ...globals.es2020
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true // Habilitar la comprensión de código JSX
        }
      }
    }
  },

  // 4. Integración de los Plugins de React y Vite
  {
    plugins: {
      // (Eliminamos 'react': reactPlugin)
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    rules: {
      // (Eliminamos las reglas recomendadas y de jsx-runtime del plugin eliminado)

      // Reglas para evitar bugs con useEffect y otros hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // Regla vital para que el recargo rápido (Fast Refresh) de Vite funcione perfecto
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Tu regla personalizada de TypeScript
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // 5. Prettier siempre al final para apagar reglas de formato que choquen
  eslintConfigPrettier
)

`

export const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()]
})

`
