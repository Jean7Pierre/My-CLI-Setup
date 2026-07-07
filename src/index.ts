#!/usr/bin/env node

import { CommandInvoker } from './patterns/Command.js'
import { InitCommand } from './commands/InitCommand.js'

async function main() {
  // process.argv trae lo que escribimos en consola.
  // [0] es la ruta de node, [1] es la ruta del script, [2] es el primer argumento real (nuestro comando).
  const args = process.argv.slice(2)

  // Si el usuario no escribe ningún comando, asumimos que quiere usar 'init' por defecto.
  const commandName = args[0] || 'init'

  // Los demás argumentos que vengan después del comando (ej. si el usuario escribe: mi-cli init --force)
  const commandArgs = args.slice(1)

  // Instanciamos nuestro Invocador
  const invoker = new CommandInvoker()

  // Registramos nuestros comandos (¡Aquí agregaremos más en el futuro!)
  invoker.register('init', new InitCommand())

  // Le decimos al invocador que haga su magia
  await invoker.executeCommand(commandName, commandArgs)
}

main().catch((error) => {
  console.error('Hubo un error crítico:', error)
  process.exit(1)
})
