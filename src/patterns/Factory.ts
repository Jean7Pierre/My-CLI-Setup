//implementar el patron Strategy para la creacion del contenido del archivo de configuracion
class PrettierConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: '.prettierrc',
      content: JSON.stringify({ semi: true, singleQuote: true, trailingComma: 'es5' }, null, 2)
    }
  }
}

class IgnoredPrettierConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: '.prettierignore',
      content: `node_modules\ndist\nbuild`
    }
  }
}
class TailwindConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {...}`
    }
  }
}

class EslintConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: 'eslint.config.mjs',
      content: `import js from "@eslint/js";\n\nexport default [\n  js.configs.recommended,\n  { rules: { "no-unused-vars": "warn" } }\n];`
    }
  }
}

class PackageJsonProvider {
  public static getFiles(projectName: string): FileNode {
    const pkg = {
      name: projectName,
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '18.3.1',
        'react-dom': '18.3.1'
      },
      devDependencies: {
        '@types/react': '18.3.3',
        '@types/react-dom': '18.3.0',
        '@vitejs/plugin-react': '4.3.1',
        typescript: '5.5.3',
        vite: '5.4.1'
      }
    }

    return {
      fileName: 'package.json',
      content: JSON.stringify(pkg, null, 2)
    }
  }
}

class FileConfig {
  constructor(
    public fileName: string = '',
    public content: string = ''
  ) {}
  showDetails() {
    return `Contenido del archivo: ${this.fileName} creado.`
  }
}

export class FileBuilder {
  private file = new FileConfig()
  reset() {
    this.file = new FileConfig()
  }
  setName(name: string) {
    this.file.fileName = name
    return this
  }
  setContent(content: string) {
    this.file.content = content
    return this
  }
  build() {
    const file = this.file
    this.reset()
    return file
  }
}

export class FileDirector {
  public makePrettierConfig(builder: FileBuilder): void {
    const { fileName, content } = PrettierConfigProvider.getFiles()
    builder.setName(fileName).setContent(content)
  }

  public makeIgnorePrettierConfig(builder: FileBuilder): void {
    const { fileName, content } = IgnoredPrettierConfigProvider.getFiles()
    builder.setName(fileName).setContent(content)
  }

  public makeEslintConfig(builder: FileBuilder): void {
    const { fileName, content } = EslintConfigProvider.getFiles()
    builder.setName(fileName).setContent(content)
  }

  public makeTailwindConfig(builder: FileBuilder): void {
    const { fileName, content } = TailwindConfigProvider.getFiles()
    builder.setName(fileName).setContent(content)
  }

  public makePackageJsonConfig(builder: FileBuilder, projectName: string): void {
    const { fileName, content } = PackageJsonProvider.getFiles(projectName)
    builder.setName(fileName).setContent(content)
  }
}

/**
 * Factory Method Pattern
 * Su única responsabilidad es delegar la creación de archivos de configuracion.
 */
abstract class ConfigGenerator {
  protected abstract createConfig(
    director: FileDirector,
    builder: FileBuilder,
    projectName?: string
  ): FileConfig[]

  /**
   * Método de fabricación.
   *
   * @param director - Object - Decide que configuracion implementar
   * @param builder - Object - Encargado de crear los objetos
   * @returns Un arreglo de FileConfig (porque una configuración podría requerir más de un archivo).
   */
  public generateConfig(director: FileDirector, builder: FileBuilder, projectName?: string): FileConfig[] {
    const config = this.createConfig(director, builder, projectName)
    return config
  }
}

export class GeneratorESlint extends ConfigGenerator {
  protected createConfig(director: FileDirector, builder: FileBuilder): FileConfig[] {
    director.makeEslintConfig(builder)
    const configObject = builder.build()
    return [configObject]
  }
}

export class GeneratorTailwind extends ConfigGenerator {
  protected createConfig(director: FileDirector, builder: FileBuilder): FileConfig[] {
    director.makeTailwindConfig(builder)
    const configObject = builder.build()
    return [configObject]
  }
}

export class GeneratorPrettier extends ConfigGenerator {
  protected createConfig(director: FileDirector, builder: FileBuilder): FileConfig[] {
    director.makePrettierConfig(builder)
    const configObject1 = builder.build()
    director.makeIgnorePrettierConfig(builder)
    const configObject2 = builder.build()
    return [configObject1, configObject2]
  }
}

export class GeneratorPackageJson extends ConfigGenerator {
  protected createConfig(director: FileDirector, builder: FileBuilder, projectName?: string): FileConfig[] {
    director.makePackageJsonConfig(builder, projectName ? projectName : 'Proyecto-uno')
    const configObject = builder.build()
    return [configObject]
  }
}
