/**
 * Implementación del Patrón Observer para manejar el feedback del CLI.
 * Utilizamos EventEmitter de Node.js, que es la forma nativa de aplicar este patrón.
 */
import { EventEmitter } from 'node:events'

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
    this.emit('start', `Iniciando: ${taskName}...`)

    return new Promise((resolve) => {
      setTimeout(() => {
        // 2. Emitimos el evento de éxito
        this.emit('success', `Completado: ${taskName} configurado correctamente.`)
        resolve()
      }, 2000)
    })
  }
}

/**
 * EL OBSERVADOR (Observer).
 * Su única responsabilidad es escuchar al Sujeto y mostrar los mensajes en la terminal.
 * No sabe nada de crear archivos, solo sabe cómo mostrar texto.
 */
export class CLILogger {
  // Guardamos las referencias a las funciones para poder desuscribir después
  private onStart = (message: string) => console.log(`⏳ ${message}`)
  private onSuccess = (message: string) => {
    console.log(`✅ ${message}`)
    console.log('----------------')
  }

  /**
   * Método explícito de Suscripción (Attach)
   */
  public attach(subject: TaskRunner) {
    subject.on('start', this.onStart)
    subject.on('success', this.onSuccess)
  }

  /**
   * Método explícito de Desuscripción (Detach)
   * 👈 Esencial para liberar memoria
   */
  public detach(subject: TaskRunner) {
    subject.off('start', this.onStart)
    subject.off('success', this.onSuccess)
  }
}
