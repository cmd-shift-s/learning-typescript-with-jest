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

  test('Number', () => {
    let decimal: number = 6
    let hex: number = 0xf00d
    let binary: number = 0b1010
    let octal: number = 0o744

    expect(typeof decimal).toBe('number')
    expect(typeof hex).toBe('number')
    expect(typeof binary).toBe('number')
    expect(typeof octal).toBe('number')

    // decimal = 'str'
    // Type '"str"' is not assignable to type 'number'.

    // decimal = true
    // Type 'true' is not assignable to type 'number'.
  })

  test('String', () => {
    let color: string = 'blue'
    color = 'red'

    expect(typeof color).toBe('string')
    expect(color).toEqual('red')

    // color = 1
    // Type '1' is not assignable to type 'string'.

    // color = false
    // Type 'false' is not assignable to type 'string'.
  })

  test('String#backquote', () => {
    let fullName: string = `Bob Bobbington`
    let age: number = 37
    let sentence: string = `Hello, my name is ${ fullName }.

I'll be ${ age + 1 } years old next month.`

    expect(sentence).toEqual("Hello, my name is " + fullName + ".\n\n" + "I'll be " + (age + 1) + " years old next month.")
  })

  test('Array', () => {
    let list: number[] = [1, 2, 3]
    // let list: Array<number>

    expect(Array.isArray(list)).toBe(true)

    // list = ['str1', 'str2', 'str3']
    // Type 'string[]' is not assignable to type 'number[]'.

    // list = [true, false]
    // Type 'boolean[]' is not assignable to type 'number[]'.
  })

  test('Tuple', () => {
    let x: [string, number]

    x = ["hello", 10]
    expect(Array.isArray(x)).toBe(true)

    // x = [10, "hello"]
    // Type '[number, string]' is not assignable to type '[string, number]'.

    expect(x[0].substr(1)).toEqual('ello')

    // x[1].substr(1)
    // Property 'substr' does not exist on type 'number'.

    expect(x[1].toString()).toBe('10')
    // 'string' and 'number' both have 'toString'

    x[3] = 'world'
    expect(x[3]).toEqual('world')

    // x[6] = true
    // Type 'ture' is not asignable to type 'string | number'
  })

  test('Enum', () => {
    enum Color {Red, Green, Blue} // {"0":"Red","1":"Green","2":"Blue","Red":0,"Green":1,"Blue":2}
    expect(typeof Color.Red).toBe('number')
    expect(Color.Red).toEqual(0)

    let c: Color = Color.Green
    expect(typeof c).toBe('number')
    expect(c).toEqual(1)

    enum Color1 {Red = 1, Green, Blue}
    expect(Color1.Red).toEqual(1)
    expect(Color1.Green).toEqual(2)
    expect(Color1.Blue).toEqual(3)

    enum Color2 {Red = 1, Green = 2, Blue = 4}
    expect(Color2.Red).toEqual(1)
    expect(Color2.Green).toEqual(2)
    expect(Color2.Blue).toEqual(4)
  })

  test('Enum#name', () => {
    enum Color {Red = 1, Green, Blue}
    let colorName: string = Color[2]
    expect(colorName).toEqual('Green')
  })

  /**
   * dynamic content.
   * 3rd pary library에서 주로 사용
   * type checking을 하지 않는다.
   */
  test('Any', () => {
    let notSure: any = 4
    expect(typeof notSure).toBe('number')
    expect(notSure).toEqual(4)

    notSure = 'maybe a string instead'
    expect(typeof notSure).toBe('string')
    expect(notSure).toEqual('maybe a string instead')

    notSure = false
    expect(typeof notSure).toBe('boolean')
    expect(notSure).toBe(false)

  })

  test('Any#method', () => {
    let notSure: any = 4
    // notSure.ifItExists()
    // okay, ifItExists might exist at runtime

    expect(notSure.toFixed()).toEqual('4')
    // okay, toFixed exists (but the compiler doesn't check)

    let prettySure: Object = 4
    // prettySure.toFixed()
    // Property 'toFixed' does not exist on type 'Object'.
  })

  test('Any#Array', () => {
    let list: any[] = [1, true, 'free']
    expect(Array.isArray(list)).toBe(true)

    list[1] = 100
    expect(list[1]).toEqual(100)
  })

  test('Void', () => {
    function warnUser(): void {
      // alert('This is my warning message')
    }

    expect(typeof warnUser()).toBe('undefined')

    // only assign `undefined` or `null`
    let unusable: void = undefined

    // unusable = 'str'
    // Type '"str"' is not assignable to type 'void'.

    // unusable = 1
    // Type '1' is not assignable to type 'void'.

    // unusable = false
    // Type 'false' is not assignable to type 'void'.
  })

  test('Null and Undefined', () => {
    // By default `null` and `undefined` are subtypes of all other types
    let u: undefined = undefined
    let n: null = null

    expect(typeof u).toBe('undefined')
    expect(typeof n).toBe('object') // ECMAScript의 버그로, null이어야 함.
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/null

    expect(u == n).toEqual(true)
    expect(u === n).toEqual(false)
  })

  /**
   * when using the `--strictNullChecks` flag,
   * `null` and `undefined` are only assignable to `void` and their respective types.
   */
  test('--strictNullChecks', () => {
    // let s: string = null
    // Type 'null' is not assignable to type 'string'.

    // let n: number = undefined
    // Type 'undefined' is not assignable to type 'number'.

    // let b: boolean = undefined
    // Type 'undefined' is not assignable to type 'boolean'.

    // let list: Array<number> = null
    // Type 'null' is not assignable to type 'number[]'.
  })

  test('Never', () => {
    // Function returning never must have unreachable end point
    function error(message: string): never {
      throw new Error(message)
    }

    expect(() => error('Message')).toThrowError('Message')

    // Inferred return type is never
    function fail() {
      return error("Something failed")
    }

    // Function returning never must have unreachable end point
    function infiniteLoop(): never {
      while (true) {

      }
    }

    // function log(message: string): never {
    //   console.log(message)
    // }
    // A function returning 'never' cannot have a reachable end point.
  })

  /**
   * Type assertions are a way to tell the compiler "trust me, i know what i'm doing."
   */
  test('Type assertions', () => {
    let someValue: any = "this is a string"
    let strLength: number = (<string>someValue).length

    expect(strLength).toEqual("this is a string".length)

    // as syntax
    strLength = (someValue as string).length

  })
})
