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
              name: 'index.css',
              isDirectory: false,
              content: '@import "tailwindcss";'
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
            '<!doctype html> \n<html lang="es"> \n<head> \n  <meta charset="utf-8" /> \n <meta name="viewport" content="width=device-width, initial-scale=1.0" /> \n  <link href="/src/style.css" rel="stylesheet"> \n  <title>Nuevo Proyecto</title> \n</head> \n<body> \n  <div id="root"></div> \n  <script type="module" src="/src/main.tsx"></script> \n</body> \n</html>'
        }
      ]
    }
  }
}
