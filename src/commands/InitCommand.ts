import { input } from '@inquirer/prompts'
import fs from 'node:fs/promises'
import path from 'node:path'
import { TaskRunner, CLILogger } from '../patterns/Observer.js'
import { FileFactory } from '../patterns/SimpleFactory.js'

/**
 * Concrete Command: InitCommand
 * Implementa la interfaz Command. Contiene toda la receta para inicializar un proyecto.
 */
export class InitCommand implements Command {
  public async execute(args: string[]): Promise<void> {
    console.log('=========================================')
    console.log('🚀 ¡Bienvenido a tu Generador Frontend! 🚀')
    console.log('=========================================\n')

    const projectName = await input({
      message: '¿Cómo se llamará tu nuevo proyecto?',
      default: 'mi-app-genial'
    })

    console.log(`\nPerfecto, vamos a preparar "${projectName}"...\n`)

    // --- PASO PREVIO: Crear la carpeta raíz del proyecto ---
    // process.cwd() obtiene la ruta de la carpeta donde el usuario abrió la terminal
    const targetDir = path.join(process.cwd(), projectName)

    // Creamos la carpeta (recursive: true evita errores si la carpeta ya existe)
    await fs.mkdir(targetDir, { recursive: true })

    // 2. Implementación del Patrón Observer
    const runner = new TaskRunner() // Creamos el Sujeto
    const cliLogger = new CLILogger() // Creamos el Observador

    // Conectamos el observador
    runner.attach(cliLogger)

    // --- EJECUCIÓN CON LA FÁBRICA ---
    // 1. Fabricamos los datos de los archivos (en memoria)
    const prettierFiles = FileFactory.createConfig('prettier')
    const eslintFiles = FileFactory.createConfig('eslint')
    const tailwindFiles = FileFactory.createConfig('tailwind')

    try {
      // 2. Le decimos al Runner que escriba esos archivos en el disco duro
      await runner.executeFileCreation('Configuración de Prettier', prettierFiles, targetDir)
      await runner.executeFileCreation('Configuración de ESLint', eslintFiles, targetDir)
      await runner.executeFileCreation('Configuración de TailwindCSS', tailwindFiles, targetDir)

      console.log(`\n🎉 ¡Proyecto "${projectName}" creado con éxito en ./${projectName}!`)
    } finally {
      runner.detach(cliLogger)
    }
  }
}
