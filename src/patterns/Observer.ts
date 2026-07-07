/**
 * Implementación del Patrón Observer para manejar el feedback del CLI con un Loader personalizado.
 * Utilizamos EventEmitter de Node.js, que es la forma nativa de aplicar este patrón.
 */
import { EventEmitter } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline' // Módulo nativo para controlar el cursor en la terminal
// Importamos nuestra nueva estructura de datos
import type { FileNode } from './SimpleFactory.js'

interface TaskEvents {
  start: [message: string]
  success: [message: string]
}

/**
 * EL SUJETO (Subject).
 * Es el encargado de realizar el trabajo pesado (como crear archivos)
 * y emitir eventos cuando algo importante sucede.
 */
export class TaskRunner extends EventEmitter<TaskEvents> {
  /**
   * Toma los archivos generados por la Fábrica y los escribe en el disco duro.
   *
   * @param taskName - El nombre descriptivo de la tarea para el Observador.
   * @param files - Arreglo de nodos de archivo (FileNode) que debemos crear.
   * @param targetDirectory - Carpeta donde se crearán los archivos.
   */
  public async executeFileCreation(
    taskName: string,
    files: FileNode[],
    targetDirectory: string
  ): Promise<void> {
    this.emit('start', `Iniciando: ${taskName}...`)

    try {
      // Algoritmo lineal: Recorremos cada archivo de la lista y lo escribimos.
      for (const file of files) {
        // path.join une las rutas de forma segura sin importar si usas Windows o Mac
        const filePath = path.join(targetDirectory, file.fileName)

        // Escribimos físicamente el archivo en el disco duro
        await fs.writeFile(filePath, file.content, 'utf-8')
      }

      // Simulamos un pequeñísimo retraso solo para que la animación en consola se aprecie
      await new Promise((resolve) => setTimeout(resolve, 800))

      this.emit('success', `Completado: ${taskName}`)
    } catch (error) {
      // Si ocurre un error (ej. permisos denegados), lo notificamos
      this.emit('error', `Fallo al ejecutar ${taskName}`)
      throw error
    }
  }
}

// --- NUEVA CLASE: El Spinner (El Libro Animado) ---
class Spinner {
  // 1. Los dibujos (Frames) de nuestra animación. Usamos caracteres braille que se ven geniales.
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  private currentFrame = 0
  // Guardamos el ID del temporizador para poder detenerlo después
  private timer: NodeJS.Timeout | null = null

  /**
   * Inicia la animación en la terminal
   * @param message El texto que acompaña al spinner (ej. "Iniciando: Configuración...")
   */
  public start(message: string): void {
    // Si ya hay un spinner corriendo, no hacemos nada
    if (this.timer) return

    // Ocultamos el cursor parpadeante de la terminal para que se vea más limpio
    process.stdout.write('\x1B[?25l')

    // 3. El pasador de páginas: Cada 80 milisegundos ejecutamos esta función
    this.timer = setInterval(() => {
      // a. Movemos el cursor de la terminal al inicio de la línea actual (columna 0)
      readline.cursorTo(process.stdout, 0)

      // b. Dibujamos el frame actual y el mensaje (process.stdout.write NO agrega un salto de línea)
      const frame = this.frames[this.currentFrame]
      // Usamos colores básicos de terminal ( \x1b[36m es Cyan, \x1b[0m resetea el color )
      process.stdout.write(`\x1b[36m${frame}\x1b[0m ${message}`)

      // c. Calculamos cuál será el siguiente frame.
      // El operador módulo (%) hace que cuando lleguemos al final, volvamos a cero.
      this.currentFrame = (this.currentFrame + 1) % this.frames.length
    }, 80)
  }

  /**
   * Detiene la animación y limpia la línea
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer) // Detenemos el temporizador
      this.timer = null

      // Limpiamos la línea actual para que el mensaje final (✅) se imprima limpio
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)

      // Volvemos a mostrar el cursor normal de la terminal
      process.stdout.write('\x1B[?25h')
    }
  }
}

/**
 * EL OBSERVADOR (Observer).
 * Su única responsabilidad es escuchar al Sujeto y mostrar los mensajes en la terminal.
 * No sabe nada de crear archivos, solo sabe cómo mostrar texto.
 */
export class CLILogger {
  private spinner: Spinner

  constructor() {
    this.spinner = new Spinner()
  }
  // Guardamos las referencias a las funciones.
  // Usamos funciones flecha para mantener el contexto de 'this' apuntando a CLILogger.
  private onStart = (message: string) => {
    this.spinner.start(message)
  }

  private onSuccess = (message: string) => {
    this.spinner.stop()
    console.log(`✅ ${message}`)
    console.log('----------------')
  }

  private onError = (message: string) => {
    this.spinner.stop()
    console.log(`❌ ${message}`)
    console.log('----------------')
  }

  /**
   * Método explícito de Suscripción (Attach)
   */
  public attach(subject: TaskRunner) {
    subject.on('start', this.onStart)
    subject.on('success', this.onSuccess)
    subject.on('error', this.onError)
  }

  /**
   * Método explícito de Desuscripción (Detach)
   * 👈 Esencial para liberar memoria
   */
  public detach(subject: TaskRunner) {
    subject.off('start', this.onStart)
    subject.off('success', this.onSuccess)
    subject.off('error', this.onError)
  }
}
