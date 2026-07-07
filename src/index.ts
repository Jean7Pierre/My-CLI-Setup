#!/usr/bin/env node

/**
 * Punto de entrada principal de nuestro CLI.
 */
import { input } from '@inquirer/prompts'
import { TaskRunner, CLILogger } from './patterns/Observer.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { FileFactory } from './patterns/SimpleFactory.js'

async function main() {
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
  cliLogger.attach(runner)

  // --- EJECUCIÓN CON LA FÁBRICA ---
  // 1. Fabricamos los datos de los archivos (en memoria)
  const prettierFiles = FileFactory.createConfig('prettier')
  const eslintFiles = FileFactory.createConfig('eslint')
  const tailwindFiles = FileFactory.createConfig('tailwind')

  // 2. Le decimos al Runner que escriba esos archivos en el disco duro
  await runner.executeFileCreation('Configuración de Prettier', prettierFiles, targetDir)
  await runner.executeFileCreation('Configuración de ESLint', eslintFiles, targetDir)
  await runner.executeFileCreation('Configuración de TailwindCSS', tailwindFiles, targetDir)

  console.log(`\n🎉 ¡Proyecto "${projectName}" creado con éxito en ./${projectName}!`)
  cliLogger.detach(runner)
}

// Como ahora usamos await, la función principal debe ser manejada
main().catch((error) => {
  console.error('Hubo un error crítico:', error)
  process.exit(1)
})
