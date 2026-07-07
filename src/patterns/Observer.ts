/**
 * Implementación del Patrón Observer para manejar el feedback del CLI.
 * Utilizamos EventEmitter de Node.js, que es la forma nativa de aplicar este patrón.
 */
import { EventEmitter } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
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
  private onError = (message: string) => console.log(`❌ ${message}`)

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
    subject.on('error', this.onError)
  }
}
