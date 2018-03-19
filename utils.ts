import * as fs from 'fs'
import * as ts from 'typescript'
import * as tmp from 'tmp'

tmp.setGracefulCleanup()

export function compile(code: string, options?: ts.CompilerOptions): Promise<string[]> {
  return new Promise<string[]>(
    (resolve, reject) => {
      tmp.file({postfix: '.ts'}, (err: Error, path: string, fd: number, cleanupCallback: Function) => {
        if (err) throw reject(err)

        fs.write(fd, code, (err: Error) => {
          if (err) throw reject(err)

          const servicesHost: ts.LanguageServiceHost = {
            getScriptFileNames: () => [path],
            getScriptVersion: () => '1',
            getScriptSnapshot: (fileName) => {
              if (!fs.existsSync(fileName)) {
                  return undefined;
              }

              return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
            },
            getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
            getCompilationSettings: () => options,
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
            readDirectory: ts.sys.readDirectory,
          };

          const service = ts.createLanguageService(servicesHost)
          const allDiagnostics = service.getCompilerOptionsDiagnostics()
            .concat(service.getSemanticDiagnostics(path))
            .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))

          resolve(allDiagnostics)
        })
      })
    }
  )
}
