import { describe, it, expect } from 'vitest';
import { ProjectTreeFactory } from './Tree.js';
import { PackageJsonProvider } from './Factory.js';
import { FileBuilder, FileDirector, GeneratorPackageJson } from './Factory.js';

describe('ProjectTreeFactory', () => {
  it('should create a React/Vite tree with correct dependencies structure', () => {
    const tree = ProjectTreeFactory.createReactViteTree();

    // Verify root
    expect(tree.name).toBe('root');
    expect(tree.isDirectory).toBe(true);

    // Check public directory
    const publicDir = tree.children?.find(child => child.name === 'public');
    expect(publicDir).toBeDefined();
    expect(publicDir?.isDirectory).toBe(true);
    expect(publicDir?.children?.find(c => c.name === 'vite.svg')).toBeDefined();

    // Check src directory
    const srcDir = tree.children?.find(child => child.name === 'src');
    expect(srcDir).toBeDefined();
    expect(srcDir?.isDirectory).toBe(true);

    // Check dependencies inside src
    const componentsDir = srcDir?.children?.find(child => child.name === 'components');
    expect(componentsDir).toBeDefined();
    expect(srcDir?.children?.find(c => c.name === 'App.tsx')).toBeDefined();
    expect(srcDir?.children?.find(c => c.name === 'index.css')).toBeDefined();
    expect(srcDir?.children?.find(c => c.name === 'main.tsx')).toBeDefined();

    // Check root files
    expect(tree.children?.find(c => c.name === 'index.html')).toBeDefined();
  });
});

describe('Factory Dependencies', () => {
  it('should include all dependencies when selectedDependencies is undefined', () => {
    const director = new FileDirector();
    const builder = new FileBuilder();
    const generator = new GeneratorPackageJson();

    const configObject = generator.generateConfig({ director, builder, projectName: 'test-app' })[0];
    const pkg = JSON.parse(configObject.content);

    expect(pkg.dependencies).toHaveProperty('react');
    expect(pkg.dependencies).toHaveProperty('react-router-dom');
    expect(pkg.dependencies).toHaveProperty('tailwindcss');
    expect(pkg.dependencies).toHaveProperty('react-error-boundary');
  });

  it('should only include specified dependencies when selectedDependencies is provided', () => {
    const director = new FileDirector();
    const builder = new FileBuilder();
    const generator = new GeneratorPackageJson();

    const configObject = generator.generateConfig({
        director,
        builder,
        projectName: 'test-app',
        selectedDependencies: ['react']
    })[0];

    const pkg = JSON.parse(configObject.content);

    // Should have react and react-dom
    expect(pkg.dependencies).toHaveProperty('react');
    expect(pkg.dependencies).toHaveProperty('react-dom');

    // Should NOT have other dependencies
    expect(pkg.dependencies).not.toHaveProperty('react-router-dom');
    expect(pkg.dependencies).not.toHaveProperty('tailwindcss');
    expect(pkg.dependencies).not.toHaveProperty('react-error-boundary');
  });
});
