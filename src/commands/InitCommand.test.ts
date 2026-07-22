import { describe, it, expect, vi, beforeEach } from 'vitest';
import { input, checkbox } from '@inquirer/prompts';
import fs from 'node:fs/promises';
import { InitCommand } from './InitCommand.js';
import { TaskRunner, CLILogger } from '../patterns/Observer.js';
import { ProjectTreeFactory } from '../patterns/Tree.js';
import {
  FileBuilder,
  FileDirector,
  GeneratorESlint,
  GeneratorPackageJson,
  GeneratorPrettier,
  GeneratorViteConfig
} from '../patterns/Factory.js';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  checkbox: vi.fn()
}));

vi.mock('node:fs/promises', () => ({
  default: {
    mkdir: vi.fn()
  }
}));

vi.mock('../patterns/Observer.js', () => {
  const attachMock = vi.fn();
  const detachMock = vi.fn();
  const executeScaffoldCreationMock = vi.fn();
  const executeFileCreationMock = vi.fn();
  return {
    CLILogger: vi.fn(),
    TaskRunner: vi.fn(() => ({
      attach: attachMock,
      detach: detachMock,
      executeScaffoldCreation: executeScaffoldCreationMock,
      executeFileCreation: executeFileCreationMock
    }))
  };
});

vi.mock('../patterns/Factory.js', () => {
  return {
    FileBuilder: vi.fn(),
    FileDirector: vi.fn(),
    GeneratorESlint: vi.fn(() => ({ generateConfig: vi.fn().mockReturnValue([]) })),
    GeneratorPackageJson: vi.fn(() => ({ generateConfig: vi.fn().mockReturnValue([]) })),
    GeneratorPrettier: vi.fn(() => ({ generateConfig: vi.fn().mockReturnValue([]) })),
    GeneratorViteConfig: vi.fn(() => ({ generateConfig: vi.fn().mockReturnValue([]) }))
  };
});

vi.mock('../patterns/Tree.js', () => {
  return {
    ProjectTreeFactory: {
      createReactViteTree: vi.fn().mockReturnValue({ name: 'root', isDirectory: true })
    }
  };
});

describe('InitCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should instantiate objects correctly and call execute methods with expected arguments', async () => {
    vi.mocked(input).mockResolvedValue('test-project');
    vi.mocked(checkbox).mockResolvedValue(['react', 'react-router-dom']);

    const command = new InitCommand();
    await command.execute();

    expect(input).toHaveBeenCalledWith({
      message: '¿Cómo se llamará tu nuevo proyecto?',
      default: 'mi-app-genial'
    });

    expect(checkbox).toHaveBeenCalled();

    expect(fs.mkdir).toHaveBeenCalledWith(expect.stringContaining('test-project'), { recursive: true });

    expect(TaskRunner).toHaveBeenCalled();
    expect(CLILogger).toHaveBeenCalled();

    expect(FileDirector).toHaveBeenCalled();
    expect(FileBuilder).toHaveBeenCalled();

    expect(GeneratorESlint).toHaveBeenCalled();
    expect(GeneratorPrettier).toHaveBeenCalled();
    expect(GeneratorPackageJson).toHaveBeenCalled();
    expect(GeneratorViteConfig).toHaveBeenCalled();

    expect(ProjectTreeFactory.createReactViteTree).toHaveBeenCalled();

    // We can extract the mocked runner instance to assert its methods were called
    const runnerInstance = new TaskRunner();
    expect(runnerInstance.attach).toHaveBeenCalled();
    expect(runnerInstance.executeScaffoldCreation).toHaveBeenCalled();
    expect(runnerInstance.executeFileCreation).toHaveBeenCalledTimes(4);
    expect(runnerInstance.detach).toHaveBeenCalled();
  });

  it('should detach observer even if an error occurs during generation', async () => {
    vi.mocked(input).mockResolvedValue('error-project');
    vi.mocked(checkbox).mockResolvedValue(['react']);

    // Create a scenario where execution throws an error
    vi.mocked(ProjectTreeFactory.createReactViteTree).mockImplementationOnce(() => {
      throw new Error('Test unexpected error');
    });

    const command = new InitCommand();

    await expect(command.execute()).rejects.toThrow('Test unexpected error');

    // Make sure detach was still called in the finally block
    const runnerInstance = new TaskRunner();
    expect(runnerInstance.detach).toHaveBeenCalled();
  });
});
