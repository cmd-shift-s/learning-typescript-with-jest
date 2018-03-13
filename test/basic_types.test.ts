describe('Basic Types', () => {
  test('Boolean', () => {
    let isDone: boolean = false
    expect(typeof isDone).toBe('boolean')
    expect(isDone).toBe(false)

    isDone = true
    expect(isDone).toBe(true)

    // isDone = 1
    // Type '1' is not assignable to type 'boolean'.

    // isDone = 'str'
    // Type '"str"' is not assignable to type 'booelan'.
  })
})