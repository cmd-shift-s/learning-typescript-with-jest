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

  describe('Generic Constraints', () => {
    test('Generic Constraints', () => {
      interface Lengthwise {
          length: number
      }

      function loggingIdentity<T extends Lengthwise>(arg: T): T {
        // console.log(arg.length) // OK
        return arg
      }

      // loggingIdentity(3)
      // Argument of type '3' is not assignable to parameter of type 'Lengthwise'.
      const val = {length: 10, value: 3}
      expect(loggingIdentity(val)).toEqual(val)
    })

    test('Using Type Parameters in Generic Constraints', () => {
      function getProperty<T, K extends keyof T>(obj: T, key: K) {
        return obj[key]
      }
      let x = {a: 1, b: 2, c: 3, d: 4}
      expect(getProperty(x, "a")).toBe(1)
      // getProperty(x, "e")
      // Argument of type "'e'" is not assignable to parameter of type ""a"|"b"|"c"|"d"".
    })

    test('Using Class Types in generics', () => {
      function create<T>(c: {new(): T}): T {
          return new c()
      }

      class BeeKeeper {
        hasMask: boolean = false
      }
      class ZooKeeper {
        nametag: string = ''
      }
      class Animal {
        numLegs: number = 0
      }
      class Bee extends Animal {
        keeper = new BeeKeeper()
      }
      class Lion extends Animal {
        keeper = new ZooKeeper()
      }
      function createInstance<A extends Animal>(c: new () => A): A {
        return new c()
      }

      const bee = createInstance(Bee)
      expect(bee.keeper).toHaveProperty('hasMask')

      const lion = createInstance(Lion)
      expect(lion.keeper).toHaveProperty('nametag')
    })
  })
})
