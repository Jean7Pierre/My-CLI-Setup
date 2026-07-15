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

/**
 * Estructura de datos: Árbol (Tree)
 * Representa un nodo en nuestro sistema de archivos.
 * Puede ser un archivo (hoja) o un directorio (rama).
 */
interface FileSystemNode {
  name: string
  isDirectory: boolean
  content?: string // Solo se usa si es un archivo
  children?: FileSystemNode[] // Solo se usa si es un directorio (¡Aquí anidamos el árbol!)
}
