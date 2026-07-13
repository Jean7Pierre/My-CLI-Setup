/**
 * Implementación del Patrón Observer para manejar el feedback del CLI con un Loader personalizado.
 * Utilizamos EventEmitter de Node.js, que es la forma nativa de aplicar este patrón.
 */
import { EventEmitter } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline'

// Definimos la interfaz del Observador para que el Sujeto no dependa de una clase concreta
export interface TaskObserver {
  onStart: (message: string) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

interface TaskEvents {
  start: [message: string]
  success: [message: string]
  error: [message: string] // Agregado para cumplir con los tipos del evento de error
}

/**
 * EL SUJETO (Subject).
 * Ahora se encarga legítimamente de la suscripción (attach) y desuscripción (detach).
 */
export class TaskRunner extends EventEmitter<TaskEvents> {
  /**
   * Método de Suscripción (Attach) -> Ahora en el Sujeto
   */
  public attach(observer: TaskObserver): void {
    this.on('start', observer.onStart)
    this.on('success', observer.onSuccess)
    this.on('error', observer.onError)
  }

  /**
   * Método de Desuscripción (Detach) -> Ahora en el Sujeto
   */
  public detach(observer: TaskObserver): void {
    this.off('start', observer.onStart)
    this.off('success', observer.onSuccess)
    this.off('error', observer.onError)
  }

  public async executeFileCreation(
    taskName: string,
    files: FileNode[],
    targetDirectory: string
  ): Promise<void> {
    this.emit('start', `Iniciando: ${taskName}...`)

    try {
      for (const file of files) {
        const filePath = path.join(targetDirectory, file.fileName)
        await fs.writeFile(filePath, file.content, 'utf-8')
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      this.emit('success', `Completado: ${taskName}`)
    } catch (error) {
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
 * Ahora es una clase limpia que solo expone sus métodos de notificación.
 * Implementa la interfaz 'TaskObserver'.
 */
export class CLILogger implements TaskObserver {
  private spinner: Spinner

  constructor() {
    this.spinner = new Spinner()
  }

  // Se exponen públicamente para que el TaskRunner pueda registrarlos
  public onStart = (message: string) => {
    this.spinner.start(message)
  }

  public onSuccess = (message: string) => {
    this.spinner.stop()
    console.log(`✅ ${message}`)
    console.log('----------------')
  }

  public onError = (message: string) => {
    this.spinner.stop()
    console.log(`❌ ${message}`)
    console.log('----------------')
  }
}
