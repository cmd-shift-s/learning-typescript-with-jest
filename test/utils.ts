import * as fs from 'fs'
import * as ts from 'typescript'
import * as tmp from 'tmp'

// graceful cleanup
tmp.setGracefulCleanup()

/**
 * Create program
 * 
 * @param code 
 * @param options 
 */
export function createProgram(code: string, options?: ts.CompilerOptions): ts.Program {
  const file = tmp.fileSync({postfix: '.ts'})
  fs.writeSync(file.fd, code)
 
  const compileOptions = {
    noEmit: true,
    ...options
  } as ts.CompilerOptions
  
  return ts.createProgram([file.name], compileOptions) 
}

/**
 * Get emit diagnostics
 * 
 * @param program 
 */
export function getEmitDiagnostics(program: ts.Program): ts.Diagnostic[] {
  const emitResult = program.emit()
  return ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)  
}
