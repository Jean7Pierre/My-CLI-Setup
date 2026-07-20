import { eslintConfig, prettierignore, prettierrc, viteConfig } from '../constanst/constants.js'
//implementar el patron Strategy para la creacion del contenido del archivo de configuracion
class PrettierConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: '.prettierrc',
      content: prettierrc
    }
  }
}

class IgnoredPrettierConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: '.prettierignore',
      content: prettierignore
    }
  }
}

class EslintConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: 'eslint.config.mjs',
      content: eslintConfig
    }
  }
}

class ViteConfigProvider {
  public static getFiles(): FileNode {
    return {
      fileName: 'vite.config.ts',
      content: viteConfig
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
        lint: 'eslint .',
        preview: 'vite preview'
      },
      dependencies: {
        '@tailwindcss/vite': '4.3.1',
        react: '19.2.7',
        'react-dom': '19.2.7',
        'react-error-boundary': '6.1.2',
        'react-router-dom': '7.15.1',
        tailwindcss: '4.3.1'
      },

      devDependencies: {
        '@vitejs/plugin-react': '4.3.1',
        '@eslint/js': '10.0.1',
        '@types/node': '24.13.2',
        '@types/react': '19.2.17',
        '@types/react-dom': '19.2.3',
        eslint: '10.5.0',
        'eslint-config-prettier': '10.1.8',
        'eslint-plugin-react-hooks': '7.1.1',
        'eslint-plugin-react-refresh': '0.5.3',
        globals: '17.6.0',
        typescript: '6.0.2',
        'typescript-eslint': '8.61.0',
        vite: '8.1.0'
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

  public makePackageJsonConfig(builder: FileBuilder, projectName: string): void {
    const { fileName, content } = PackageJsonProvider.getFiles(projectName)
    builder.setName(fileName).setContent(content)
  }

  public makeViteConfig(builder: FileBuilder): void {
    const { fileName, content } = ViteConfigProvider.getFiles()
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

export class GeneratorViteConfig extends ConfigGenerator {
  protected createConfig(director: FileDirector, builder: FileBuilder): FileConfig[] {
    director.makeViteConfig(builder)
    const configObject = builder.build()
    return [configObject]
  }
}
