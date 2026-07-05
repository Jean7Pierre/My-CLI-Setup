#!/usr/bin/env node

/**
 * Punto de entrada principal de nuestro CLI.
 * El comentario superior (shebang) le dice al sistema operativo
 * que ejecute este archivo utilizando Node.js.
 */

function main() {
  // process.argv contiene los argumentos que el usuario escribe en la terminal.
  // Los dos primeros elementos son rutas del sistema, así que los ignoramos usando slice(2).
  const args = process.argv.slice(2)

  console.log('process.argv0:', process.argv0)
  console.log('process.argv[1]:', process.argv[1])
  console.log('¡Bienvenido a tu creador de proyectos frontend!')
  console.info('Argumentos recibidos:', args)
}

// Ejecutamos la función principal
main()
