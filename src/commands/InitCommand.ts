import { input, checkbox } from '@inquirer/prompts'
import fs from 'node:fs/promises'
import path from 'node:path'
import { TaskRunner, CLILogger } from '../patterns/Observer.js'
import {
  FileBuilder,
  FileDirector,
  GeneratorESlint,
  GeneratorPackageJson,
  GeneratorPrettier,
  GeneratorViteConfig
} from '../patterns/Factory.js'
// Agrega la importación en la parte superior:
import { ProjectTreeFactory } from '../patterns/Tree.js'
import figlet from 'figlet'
import boxen from 'boxen'
import gradient from 'gradient-string'
import pc from 'picocolors'

/**
 * Concrete Command: InitCommand
 * Implementa la interfaz Command. Contiene toda la receta para inicializar un proyecto.
 */
export class InitCommand implements Command {
  private async typeWriter(text: string, delay = 5): Promise<void> {
    const tokens = text.match(/\x1B\[\d*(?:;\d+)*[a-zA-Z]|./gs) || []
    for (const token of tokens) {
      process.stdout.write(token)
      if (!token.startsWith('\x1B')) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    process.stdout.write('\n')
  }

  public async execute(): Promise<void> {
    const asciiText = figlet.textSync('MY-CLI-SETUP', { font: 'Standard' })
    const gradientText = gradient.pastel.multiline(asciiText)
    const description = pc.bold(pc.cyan('Set up your workspace instantly.'))
    const fullMessage = `${gradientText}\n\n${description}`

    const boxedMessage = boxen(fullMessage, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      textAlignment: 'center'
    })

    await this.typeWriter(boxedMessage, 2)

    console.log(pc.dim('  (Presiona Ctrl+C en cualquier momento para salir)\n'))

    try {
      const projectName = await input({
        message: '¿Cómo se llamará tu nuevo proyecto?',
        default: 'mi-app-genial'
      })

      const selectedDependencies = await checkbox({
        message: 'Selecciona las dependencias de producción que deseas incluir:',
        choices: [
          { name: 'React (incluye react y react-dom)', value: 'react', checked: true },
          { name: 'React Router', value: 'react-router-dom' },
          { name: 'TailwindCSS (incluye @tailwindcss/vite)', value: 'tailwindcss' },
          { name: 'React Error Boundary', value: 'react-error-boundary' }
        ]
      })

      console.log(`\nPerfecto, vamos a preparar "${projectName}"...\n`)

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
      const director = new FileDirector()
      const builder = new FileBuilder()
      const eslint = new GeneratorESlint()
      const eslintFiles = eslint.generateConfig({ director, builder })
      const prettier = new GeneratorPrettier()
      const prettierFiles = prettier.generateConfig({ director, builder })
      const packageJson = new GeneratorPackageJson()
      const packageJsonFiles = packageJson.generateConfig({ director, builder, projectName, selectedDependencies })
      const vite = new GeneratorViteConfig()
      const viteConfig = vite.generateConfig({ director, builder })

      try {
        // 1. Obtenemos el árbol (Scaffolding) desde nuestra Fábrica
        const reactTree = ProjectTreeFactory.createReactViteTree()

        // 2. Ejecutamos la creación del árbol (carpetas anidadas y archivos base)
        await runner.executeScaffoldCreation('Estructura base de React + Vite', reactTree, targetDir)
        // 3. Le decimos al Runner que escriba esos archivos en el disco duro
        await runner.executeFileCreation('Configuración de Prettier', prettierFiles, targetDir)
        await runner.executeFileCreation('Configuración de ESLint', eslintFiles, targetDir)
        await runner.executeFileCreation('Configuración de TailwindCSS', viteConfig, targetDir)
        await runner.executeFileCreation('Configuración de packege.json', packageJsonFiles, targetDir)

        console.log(`\n🎉 ¡Proyecto "${projectName}" creado con éxito en ./${projectName}!`)
      } finally {
        runner.detach(cliLogger)
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(pc.yellow('\n\nOperación cancelada por el usuario. ¡Hasta pronto!\n'))
        process.exit(0)
      }

      throw error
    }
  }
}
