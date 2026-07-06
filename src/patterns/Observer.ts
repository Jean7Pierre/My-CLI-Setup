/**
 * Implementación del Patrón Observer para manejar el feedback del CLI.
 * Utilizamos EventEmitter de Node.js, que es la forma nativa de aplicar este patrón.
 */
import { EventEmitter } from 'node:events'

// 1. Defines estrictamente qué eventos existen y qué parámetros reciben
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
   * Simula la ejecución de una tarea.
   * @param taskName - El nombre de la tarea a ejecutar (ej. "Configurando Tailwind")
   */
  public async executeTask(taskName: string): Promise<void> {
    // 1. Emitimos el evento de que hemos comenzado
    this.emit('start', `Iniciando: ${taskName}...`)

    // Simulamos un retraso (como si estuviera descargando o creando archivos)
    // En el futuro, aquí irá el código real de creación de archivos.
    return new Promise((resolve) => {
      setTimeout(() => {
        // 2. Emitimos el evento de éxito
        this.emit('success', `Completado: ${taskName} configurado correctamente.`)
        resolve()
      }, 1500)
    })
  }
}

/**
 * EL OBSERVADOR (Observer).
 * Su única responsabilidad es escuchar al Sujeto y mostrar los mensajes en la terminal.
 * No sabe nada de crear archivos, solo sabe cómo mostrar texto.
 */
export class CLILogger {
  /**
   * @param subject - El TaskRunner al que nos vamos a suscribir
   */
  constructor(subject: TaskRunner) {
    // Nos suscribimos al evento 'start'
    subject.on('start', (message) => {
      console.log(`⏳ ${message}`)
    })

    // Nos suscribimos al evento 'success'
    subject.on('success', (message) => {
      console.log(`✅ ${message}`)
      console.log('----------------')
    })
  }
}
