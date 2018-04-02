describe('Generics', () => {
  test('Hello World of Generics', () => {
    function identity<T>(arg: T): T {
      // arg.length
      // Property 'length' does not exist on type 'T'.
      return arg
    }

    function loggingIdentity<T>(args: Array<T>): Array<T>
    function loggingIdentity<T>(args: T[]): T[] {
      console.log(args.length)
      return args
    }

    {
      let output = identity<string>('myString')
      expect(typeof output).toBe('string')
      expect(output).toBe('myString')
    }
    {
      // type argument inference
      let output = identity('myString')
      expect(typeof output).toBe('string')
      expect(output).toBe('myString')
    }
  })

  test('Generic Types', () => {
    function identity<T>(arg: T): T {
      return arg
    }
    { let myIdentity: <T>(arg: T) => T = identity }
    { let myIdentity: <U>(arg: U) => U = identity }
    { let myIdentity: {<T>(arg: T): T} = identity }
    {
      interface GenericIdentityFn {
        <T>(arg: T): T
      }
      let myIdentity: GenericIdentityFn = identity
    }
    {
      interface GenericIdentityFn<T> {
        (arg: T): T
      }
      let myIdentity: GenericIdentityFn<number> = identity
      // myIdentity('string')
      // Assignment of type "'string'" is not assignable to parameter of type 'number'.
      expect(myIdentity(1)).toBe(1)
    }
  })

  test('Generic Classes', () => {
    class GenericNumber<T> {
      zeroValue: T
      add: (x: T, y: T) => T
    }
    {
      let myGenericNumber = new GenericNumber<number>()
      myGenericNumber.zeroValue = 0
      // myGenericNumber.zeroValue = 'str'
      // Type "'str'" is not assignable to type 'number'.

      myGenericNumber.add = (x, y) => x + y
      // myGenericNumber.add = (x, y) => ''
      // Type '(x, y) => string' is not assignable to type '(x, y) => number'.
    }
    {
      let stringNumeric = new GenericNumber<string>()
      stringNumeric.zeroValue = ''
      stringNumeric.add = (x, y) => x + y
      expect(stringNumeric.add(stringNumeric.zeroValue, 'test')).toBe('test')
    }
  })
})
