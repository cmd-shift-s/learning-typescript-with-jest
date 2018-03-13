import {createProgram, getEmitDiagnostics} from './utils'

describe('Basic Types', () => {
  describe('Boolean', () => {
    test('typeof', () => {
      let isDone: boolean = false
      expect(typeof isDone).toBe('boolean')
    })
    test('type not assignable', () => {
      const program = createProgram(`
        let isDone: boolean = false
        isDone = 1
      `)
      const diagnostics = getEmitDiagnostics(program)
      expect(diagnostics.pop().messageText).toEqual(`Type '1' is not assignable to type 'boolean'.`)
    })
  })
})