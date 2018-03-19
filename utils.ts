import * as fs from 'fs'
import * as ts from 'typescript'
import * as tmp from 'tmp'

tmp.setGracefulCleanup()

export function compile(code: string, options?: ts.CompilerOptions): string[] {
  const file = tmp.fileSync({postfix: '.ts'})
  fs.writeSync(file.fd, code)

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => [file.name],
    getScriptVersion: () => '1',
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
          return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  };

  const service = ts.createLanguageService(servicesHost)
  return service.getCompilerOptionsDiagnostics()
    .concat(service.getSemanticDiagnostics(file.name))
    .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
}
