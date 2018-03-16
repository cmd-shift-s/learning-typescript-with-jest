
describe('Variable Declarations', () => {
  describe('Var declarations', () => {

    test('var declarations', () => {
      function f() {
        var a: number = 10
        return function g() {
          var b = a + 1
          return b
        }
      }

      var g = f()
      expect(typeof g).toBe('function')
      expect(g()).toEqual(11)
    })

    test('captured the variable', () => {
      function f() {
        var a = 1
        a = 2
        var b = g()
        a = 3

        return b

        function g() {
          return a
        }
      }

      expect(f()).toEqual(2)
    })

    test('Scoping rules', () => {
      // `var` declarations are accessible anywhere within their containing function, module, namespace, or global scope
      function f(shouldInitialize: boolean) {
        if (shouldInitialize) {
          var x = 10
        }

        return x
      }

      expect(f(true)).toEqual(10)
      expect(f(false)).toEqual(undefined)
    })

    test('Scoping rules#mistakes', () => {
      function sumMatrix(matrix: number[][]) {
        var sum = 0
        for (var i = 0; i < matrix.length; i++) {
          var currentRow = matrix[i]
          for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i]
          }
        }

        return sum
      }

      expect(sumMatrix([[1, 2, 3, 4 , 5], [6, 7, 8, 9, 10]])).not.toEqual(55) // return 15
    })
  })

  describe('let declarations', () => {
    test('Block-scoping', () => {
      function f(input: boolean) {
        let a = 100

        if (input) {
          let b = a + 1
          return b
        }

        // return b
        // Cannot find name 'b'.
      }


      try {
        throw 'oh no!'
      } catch(e) {
        console.log('Oh well.')
      }

      // console.log(e)
      // Cannot find name 'e'.

      function foo() {
        // okay to captrue 'a'
        return a
      }

      expect(foo()).toBe(undefined)

      // a++ // illegal to use 'a' before it's declared
      // Block-scoped variable 'a' used before its declaration.
      let a = 1

    })

    test('Re-declarations and Shadowing', () => {
      function f(x) {
        var x
        var x

        if (true) {
          var x
        }
      }

      let x = 10
      // let x = 20
      // Cannot redeclare block-scoped variable 'x'.

      function fx(x) {
        // let x = 100
        // Duplicate identifier 'x'.
      }

      function g() {
        let x = 100
        // var x = 100
        // Cannot redeclare block-scoped variable 'x'.
      }

      function fc(condition: boolean, x: number) {
        if (condition) {
          let x = 100
          return x
        }

        return x
      }

      expect(fc(false, 0)).toBe(0)
      expect(fc(true, 0)).toBe(100)

      function sumMatrix(matrix: number[][]) {
        var sum = 0
        for (let i = 0; i < matrix.length; i++) {
          var currentRow = matrix[i]
          for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i]
          }
        }

        return sum
      }

      expect(sumMatrix([[1, 2, 3, 4 , 5], [6, 7, 8, 9, 10]])).toEqual(55)
    })

    test('Block-scoped variable capturing', () => {

      function theCityThatAlwaysSleeps() {
        let getCity

        if (true) {
          let city = 'Seoul'
          getCity = function () {
            return city
          }
        }

        return getCity()
      }

      expect(theCityThatAlwaysSleeps()).toBe('Seoul')
    })
  })

  describe('const declarations', () => {
    const numLivesForCat = 9
    const kitty = {
      name: 'Aurora',
      numLives: numLivesForCat
    }

    // kitty = {
    //   name: 'Danielle',
    //   numLives: numLivesForCat
    // }
    // Cannot assign to 'kitty' because it is a constant or a read-only property.

    // all okay
    kitty.name = 'Rory'
    expect(kitty.name).toBe('Rory')

    kitty.name = 'Kitty'
    expect(kitty.name).toBe('Kitty')

    kitty.name = 'Cat'
    expect(kitty.name).toBe('Cat')

    kitty.numLives--
    expect(kitty.numLives).toBe(numLivesForCat - 1)
  })

  describe('Destructuring', () => {
    test('Array destructuring', () => {
      let input = [1, 2]
      let [first, second] = input

      expect(first).toBe(input[0])
      expect(second).toBe(input[1])

      first++, first--
      // Left size of comma operator is unused and has no side effects.
      // swap variables
      [first, second] = [second, first]
      expect(first).toBe(input[1])
      expect(second).toBe(input[0])

      function f([first, second]: [number, number]) {
      }
      f([1, 2])

      let [item1, ...rest] = [1, 2, 3, 4]
      expect(item1).toBe(1)
      expect(rest).toEqual([2, 3, 4])
    })

    test('Object destructuring', () => {
      let o = {
        a: 'foo',
        b: 12,
        c: 'bar'
      }
      let {a, b} = o

      expect(a).toBe(o.a)
      expect(b).toBe(o.b)

      {
        let {a, ...passthrough} = o
        let total = passthrough.b + passthrough.c.length
      }
    })

    test('Property renaming', () => {
      let o = {
        a: 'foo',
        b: 12,
        c: 'bar'
      }
      {
        let { a: newName1, b: newName2 } = o
        expect(newName1).toBe(o.a)
        expect(newName2).toBe(o.b)
      }
      {
        let {a, b}: {a: string, b:number} = o
      }
    })

    test('Default values', () => {
      function keepWholeObject(wholeObject: {a: string, b?: number}) {
        let {a, b = 1001} = wholeObject
      }

      // keepWholeObject({c: 1})
      // Argument of type '{c: number}' is not assignable to parameter of type '{a: string, b?: number}'.
    })

    test('Function declarations', () => {
      type C = {a: string, b?: number}
      function f1({a, b}: C): void {}

      function f2({a, b} = {a: '', b: 0}): void {}
      f2() // ok, default to {a: '', b: 0}

      function f3({a, b = 0} = {a: ''}): void {}
      f3({a: 'yes'}) // default b = 0
      f3() // default {a: '', b: 0}
      // f3({})
      // Argument of type '{}' is not assignable to parameter of type '{a: string, b?: number}'.
    })

    test('Spread', () => {
      let first = [1, 2]
      let second = [3, 4]
      let bothPlus = [0, ...first, ...second, 5]

      expect(bothPlus).toEqual([0, 1, 2, 3, 4, 5])

      let defaults = {food: 'spicy', price: '$$', ambiance: 'noisy'}
      let search = {...defaults, food: 'rich'}
      expect(search.food).toBe('rich')
      search = {food: 'rich', ...defaults}
      expect(search.food).toBe(defaults.food)

      class C {
        p = 12
        m() {

        }
      }
      let c = new C()
      let clone = {...c}
      expect(clone.p).toBe(c.p)
      expect(clone).not.toHaveProperty('m')
    })
  })
})
