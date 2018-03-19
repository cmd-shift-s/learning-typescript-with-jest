import {compile} from '../utils'

describe.skip('Utils', () => {
  test('compile', () => {
    const diagnostics = compile(`
      let isDone: boolean = 1
      `)
    expect(diagnostics[0]).toBe(`Type '1' is not assignable to type 'boolean'.`)
  })
})
