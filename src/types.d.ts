/**
 * Interface de cada comando (El Contrato).
 * Cualquier comando que queramos agregar a nuestro CLI (init, help, version)
 * DEBE implementar esta interfaz. Garantiza que todos tengan un método execute().
 */
interface Command {
  /**
   * Método que se ejecuta cuando el usuario llama al comando.
   * @param args - Argumentos adicionales que el usuario pueda escribir en la terminal.
   */
  execute(args: string[]): Promise<void>
}

/**
 * Estructura de Datos: Nodo de Archivo (FileNode)
 * Representa la unidad básica de nuestro proyecto.
 * Al definir esta "interfaz" (contrato), nos aseguramos de que TypeScript
 * nos alerte si olvidamos ponerle nombre o contenido a un archivo.
 */
interface FileNode {
  fileName: string
  content: string
}
