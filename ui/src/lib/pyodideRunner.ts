// Pyodide Runner with Multi-File Support
// Handles Python code execution with virtual filesystem for imports

import { VirtualFile } from './virtualFileSystem';

declare global {
    interface Window {
        loadPyodide?: () => Promise<PyodideInterface>;
        pyodide?: PyodideInterface;
    }
}

interface PyodideInterface {
    runPythonAsync: (code: string) => Promise<unknown>;
    FS: {
        writeFile: (path: string, content: string) => void;
        mkdir: (path: string) => void;
        readdir: (path: string) => string[];
    };
    loadPackage: (packages: string[]) => Promise<void>;
    globals: {
        get: (name: string) => unknown;
    };
}

let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;

// Load Pyodide (singleton)
export async function loadPyodideRuntime(): Promise<PyodideInterface> {
    if (pyodideInstance) {
        return pyodideInstance;
    }

    if (isLoading) {
        // Wait for existing load to complete
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return pyodideInstance!;
    }

    isLoading = true;

    try {
        // Load Pyodide script if not present
        if (!window.loadPyodide) {
            await new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Pyodide'));
                document.head.appendChild(script);
            });
        }

        pyodideInstance = await window.loadPyodide!();
        return pyodideInstance;
    } finally {
        isLoading = false;
    }
}

// Mount virtual files to Pyodide filesystem
export async function mountFilesToPyodide(
    pyodide: PyodideInterface,
    files: Record<string, VirtualFile>
): Promise<void> {
    // Create /project directory
    try {
        pyodide.FS.mkdir('/project');
    } catch {
        // Directory might already exist
    }

    // Write each file
    for (const file of Object.values(files)) {
        const filename = file.name;
        const filepath = `/project/${filename}`;

        try {
            pyodide.FS.writeFile(filepath, file.content);
        } catch (error) {
            console.error(`Failed to write ${filepath}:`, error);
        }
    }

    // Add /project to Python path
    await pyodide.runPythonAsync(`
import sys
if '/project' not in sys.path:
    sys.path.insert(0, '/project')
`);
}

// Execute Python code with all project files available
export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    testResults?: TestResult[];
}

export interface TestResult {
    name: string;
    passed: boolean;
    message?: string;
}

export async function executePythonCode(
    files: Record<string, VirtualFile>,
    entryFile?: string
): Promise<ExecutionResult> {
    try {
        const pyodide = await loadPyodideRuntime();

        // Mount all files
        await mountFilesToPyodide(pyodide, files);

        // Find entry file (or first .py file)
        const entry = entryFile
            ? files[entryFile]
            : Object.values(files).find(f => f.isEntry)
            || Object.values(files).find(f => f.name.endsWith('.py'));

        if (!entry) {
            return {
                success: false,
                output: '',
                error: 'No Python file found to execute',
            };
        }

        // Capture stdout
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
_stdout_capture = StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout_capture
`);

        // Execute the entry file
        try {
            await pyodide.runPythonAsync(entry.content);

            // Get captured output
            const output = await pyodide.runPythonAsync(`
sys.stdout = _old_stdout
_stdout_capture.getvalue()
`) as string;

            return {
                success: true,
                output: output || '',
            };
        } catch (execError) {
            // Restore stdout and get any partial output
            const output = await pyodide.runPythonAsync(`
sys.stdout = _old_stdout
_stdout_capture.getvalue()
`) as string;

            return {
                success: false,
                output: output || '',
                error: String(execError),
            };
        }
    } catch (error) {
        return {
            success: false,
            output: '',
            error: `Pyodide error: ${error}`,
        };
    }
}

// Run tests with pytest-like output
export async function runPythonTests(
    files: Record<string, VirtualFile>,
    testCode: string
): Promise<ExecutionResult> {
    try {
        const pyodide = await loadPyodideRuntime();

        // Mount all files
        await mountFilesToPyodide(pyodide, files);

        // Write test file
        pyodide.FS.writeFile('/project/test_mission.py', testCode);

        // Run tests with custom test runner
        const testRunner = `
import sys
from io import StringIO

_test_output = StringIO()
_test_results = []

def run_tests():
    import test_mission
    
    # Find all test functions
    test_funcs = [name for name in dir(test_mission) if name.startswith('test_')]
    
    for test_name in test_funcs:
        try:
            test_func = getattr(test_mission, test_name)
            test_func()
            _test_results.append({'name': test_name, 'passed': True, 'message': 'OK'})
            print(f"✓ {test_name}: PASSED")
        except AssertionError as e:
            _test_results.append({'name': test_name, 'passed': False, 'message': str(e)})
            print(f"✗ {test_name}: FAILED - {e}")
        except Exception as e:
            _test_results.append({'name': test_name, 'passed': False, 'message': str(e)})
            print(f"✗ {test_name}: ERROR - {e}")
    
    passed = sum(1 for r in _test_results if r['passed'])
    total = len(_test_results)
    print(f"\\n{passed}/{total} tests passed")
    
    return _test_results

# Capture output
_old_stdout = sys.stdout
sys.stdout = _test_output

try:
    _results = run_tests()
finally:
    sys.stdout = _old_stdout

(_test_output.getvalue(), _results)
`;

        const result = await pyodide.runPythonAsync(testRunner) as [string, TestResult[]];
        const [output, testResults] = result;

        const allPassed = testResults.every(t => t.passed);

        return {
            success: allPassed,
            output,
            testResults,
        };
    } catch (error) {
        return {
            success: false,
            output: '',
            error: `Test execution error: ${error}`,
        };
    }
}
