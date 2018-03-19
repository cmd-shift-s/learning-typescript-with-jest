import {compile} from '../utils'

describe('Utils', () => {
  test.skip('compile', async () => {
    const diagnostics = await compile(`
      let isDone: boolean = 1
      `)
    expect(diagnostics[0]).toBe(`Type '1' is not assignable to type 'boolean'.`)
  })
})
