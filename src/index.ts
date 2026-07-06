#!/usr/bin/env node

/**
 * Punto de entrada principal de nuestro CLI.
 */
import { input } from '@inquirer/prompts'
import { TaskRunner, CLILogger } from './patterns/Observer.js'

async function main() {
  console.log('=========================================')
  console.log('🚀 ¡Bienvenido a tu Generador Frontend! 🚀')
  console.log('=========================================\n')

  // 1. Fase de Interactividad: Hacemos una pregunta al usuario
  // Esto pausa la ejecución hasta que el usuario responda y presione Enter.
  const projectName = await input({
    message: '¿Cómo se llamará tu nuevo proyecto?',
    default: 'mi-app-genial'
  })

  console.log(`\nPerfecto, vamos a preparar "${projectName}"...\n`)

  // 2. Implementación del Patrón Observer
  const runner = new TaskRunner() // Creamos el Sujeto
  new CLILogger(runner) // Creamos el Observador y lo conectamos al Sujeto

  // 3. Ejecutamos las tareas.
  // Nota cómo aquí solo llamamos a la lógica, no escribimos console.log().
  // El Observer se encarga de mostrar los mensajes.
  await runner.executeTask('Estructura base de React + Vite')
  await runner.executeTask('Configuración de TypeScript')
  await runner.executeTask('Archivos de Prettier y ESLint')
  await runner.executeTask('Configuración de TailwindCSS')

  console.log(`\n🎉 ¡Proyecto "${projectName}" creado con éxito!`)
}

// Como ahora usamos await, la función principal debe ser manejada
main().catch((error) => {
  console.error('Hubo un error crítico:', error)
  process.exit(1)
})
