/**
 * Estructura de Datos: Nodo de Archivo (FileNode)
 * Representa la unidad básica de nuestro proyecto.
 * Al definir esta "interfaz" (contrato), nos aseguramos de que TypeScript
 * nos alerte si olvidamos ponerle nombre o contenido a un archivo.
 */
export interface FileNode {
  fileName: string
  content: string
}

// 1. Definimos los generadores de forma independiente
const configGenerators: Record<'prettier' | 'eslint' | 'tailwind', () => FileNode[]> = {
  prettier: () => [
    {
      fileName: '.prettierrc',
      // Usamos JSON.stringify para que formatee el objeto como un JSON real
      content: JSON.stringify({ semi: true, singleQuote: true, trailingComma: 'es5' }, null, 2)
    },
    {
      // Los backticks (`) nos permiten crear strings de múltiples líneas fácilmente
      fileName: '.prettierignore',
      content: `node_modules\ndist\nbuild`
    }
  ],
  eslint: () => [
    {
      fileName: 'eslint.config.mjs',
      content: `import js from "@eslint/js";\n\nexport default [\n  js.configs.recommended,\n  { rules: { "no-unused-vars": "warn" } }\n];`
    }
  ],
  tailwind: () => [
    {
      fileName: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n}`
    }
  ]
}

/**
 * EL PATRÓN Simple FACTORY (Fábrica).
 * Su única responsabilidad es centralizar la creación del contenido de los archivos.
 * Si mañana cambia la regla recomendada de ESLint, solo modificas este archivo,
 * sin tocar la lógica principal de tu CLI.
 */
export class FileFactory {
  /**
   * Método estático de fabricación.
   * Al ser 'static', no necesitamos hacer `new FileFactory()` para usarlo.
   *
   * @param configType - El tipo de configuración que queremos generar.
   * @returns Un arreglo de FileNode (porque una configuración podría requerir más de un archivo).
   */
  public static createConfig(configType: keyof typeof configGenerators): FileNode[] {
    const generator = configGenerators[configType]

    if (!generator) {
      throw new Error(`Configuración no soportada: ${configType}`)
    }

    return generator()
  }
}
