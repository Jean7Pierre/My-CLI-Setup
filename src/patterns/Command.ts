/**
 * INTERFAZ COMMAND (El Contrato).
 * Cualquier comando que queramos agregar a nuestro CLI (init, help, version)
 * DEBE implementar esta interfaz. Garantiza que todos tengan un método execute().
 */
export interface Command {
  /**
   * Método que se ejecuta cuando el usuario llama al comando.
   * @param args - Argumentos adicionales que el usuario pueda escribir en la terminal.
   */
  execute(args: string[]): Promise<void>
}

/**
 * EL INVOCADOR (El Mesero).
 * Se encarga de registrar los comandos disponibles y decidir cuál ejecutar
 * en base a lo que el usuario escribió en la terminal.
 */
export class CommandInvoker {
  // Un "diccionario" para guardar nuestros comandos.
  // La clave es el nombre del comando (ej. "init") y el valor es la clase que lo maneja.
  private commands: Record<string, Command> = {}

  /**
   * Registra un nuevo comando en nuestro CLI.
   */
  public register(commandName: string, command: Command): void {
    this.commands[commandName] = command
  }

  /**
   * Busca y ejecuta el comando solicitado.
   */
  public async executeCommand(commandName: string, args: string[]): Promise<void> {
    const command = this.commands[commandName]

    if (command) {
      // Si el comando existe, le decimos que se ejecute y le pasamos los argumentos
      await command.execute(args)
    } else {
      // Si el usuario escribe algo que no existe (ej. mi-cli volar)
      console.log(`❌ Error: El comando '${commandName}' no es reconocido.`)
      console.log(`💡 Intenta ejecutar: init`)
    }
  }
}
