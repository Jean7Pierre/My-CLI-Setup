interface FileSystemNode {
  name: string
  isDirectory: boolean
  content?: string // Solo se usa si es un archivo
  children?: FileSystemNode[] // Solo se usa si es un directorio (¡Aquí anidamos el árbol!)
}
/**
 * EL Patrón Factory (Fábrica) aplicado a nuestro Árbol.
 * Genera el andamiaje (scaffold) completo de un proyecto React/Vite.
 */
export class ProjectTreeFactory {
  public static createReactViteTree(): FileSystemNode {
    // Retornamos el Nodo Raíz (La carpeta principal del proyecto)
    return {
      name: 'root', // El nombre real se lo daremos al momento de crear la carpeta
      isDirectory: true,
      children: [
        {
          name: 'public',
          isDirectory: true,
          children: [{ name: 'vite.svg', isDirectory: false, content: '<svg>Logo de Vite</svg>' }]
        },
        {
          name: 'src',
          isDirectory: true,
          children: [
            {
              name: 'components',
              isDirectory: true,
              children: [
                // Puedes anidar carpetas infinitamente gracias al diseño del Árbol
                {
                  name: 'Button.tsx',
                  isDirectory: false,
                  content: 'export const Button = () => <button>Click</button>;'
                }
              ]
            },
            {
              name: 'App.tsx',
              isDirectory: false,
              content:
                'import { Button } from "./components/Button";\n\nexport default function App() {\n  return <div>Hola React <Button /></div>;\n}'
            },
            {
              name: 'main.tsx',
              isDirectory: false,
              content:
                'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")!).render(<App />);'
            }
          ]
        },
        {
          name: 'index.html',
          isDirectory: false,
          content:
            '<!DOCTYPE html>\n<html lang="es">\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>'
        }
      ]
    }
  }
}
