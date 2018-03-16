
describe('Interfaces', () => {
  test('Our First Interface', () => {
    interface LabelledValue {
      label: string
    }

    function printLabel(labelledObj: LabelledValue): string {
      return labelledObj.label
    }

    let myObj = {size: 10, label: 'size 10 Object'}
    expect(printLabel(myObj)).toBe(myObj.label)
  })

  test('Optional Properties', () => {
    interface SequareConfig {
      color?: string
      width?: number
    }

    function createSquare(config: SequareConfig): {color: string, area: number} {
      let newSquare = {color: 'white', area: 100}
      if (config.color) {
        newSquare.color = config.color
      }
      // if (config.clor) {
      // Property 'clor' does not exist on type 'SequareConfig'. Did you mean 'color'?
      // }
      if (config.width) {
        newSquare.area = config.width * config.width
      }
      return newSquare
    }

    let mySquare = createSquare({color: 'black'})
    expect(mySquare.area).toBe(100)
  })

  test('Readonly properties', () => {
    interface Point {
      readonly x: number
      readonly y: number
    }
    let point: Point = {x: 10, y: 20}
    // point.x = 5
    // Cannot assign to 'x' because it is a constant or a read-only property.

    let a: number[] = [1, 2, 3, 4]
    let ro: ReadonlyArray<number> = a
    // ro[0] = 12
    // Index signature in type 'ReadonlyArray<number>' only permits reading.
    // ro.push(5)
    // Property 'push' does not exist on type 'ReadonlyArray<number>'.
    // a = ro
    // Type 'ReadonlyArray<number>' is not assignable to type 'number[]'.
    a = ro as number[]

    // Variables use `const` whereas properties use `readonly`.
  })

  test('Excess Property Checks', () => {
    interface SquareConfig {
      color?: string
      width?: number
      [propName: string]: any
    }

    const createSquare = (config: SquareConfig) => config.color

    let squareOptions = {colour: 'red', width: 100}
    let mySquare = createSquare(squareOptions)
  })

  test('Function Types', () => {
    interface SearchFunc {
      (source: string, subString: string): boolean
    }

    let mySearch: SearchFunc
    mySearch = function (source: string, subString: string): boolean {
      let result = source.search(subString)
      return result > -1
    }

    mySearch = function (src: string, sub: string): boolean {
      let result = src.search(sub)
      return result > -1
    }
  })

  test('Indexable Types', () => {
    interface StringArray {
      [index: number]: string
    }

    let myArray: StringArray
    myArray = ['Bob', 'Fred']

    class Animal {
      name: string
    }
    class Dog extends Animal {
      breed: string
    }

    interface NotOkay {
      // [x: number]: Animal
      // Numeric index type 'Animal' is not assignable to string index type 'Dog'
      [x: string]: Dog
    }

    interface NumberDictionary {
      [index: string]: number
      length: number
      // name: string
      // Property 'name' of type 'string' is not assignable to string index type 'number'.
    }

    interface ReadonlyStringArray {
      readonly [index: number]: string
    }
    {
      let myArray: ReadonlyStringArray = ['Alice', 'Bob']
      // myArray[2] = 'Mallory'
      // Index signature in type 'ReadonlyStringArray' only permits reading.
    }
  })

  test('Class Types', () => {
    interface ClockInterface {
      currentTime: Date
      setTime(d: Date): void
      tick(): string
    }

    class Clock implements ClockInterface {
      currentTime: Date
      setTime(d: Date) {
        this.currentTime = d
      }
      tick(): string { return 'tick tock' }
      constructor(h: number, m: number) {}
    }

    interface ClockConstructor {
      new (h: number, m: number): ClockInterface
    }

    function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
      return new ctor(hour, minute)
    }

    class DigitalClock implements ClockInterface {
      currentTime: Date
      setTime(d: Date) {
        this.currentTime = d
      }
      constructor(h: number, m: number) {}
      tick(): string {
        return 'beep beep'
      }
    }

    let digital = createClock(DigitalClock, 12, 17)
    expect(digital.tick()).toBe('beep beep')
  })

  test('Extending Interfaces', () => {
    interface Shape {
      color: string
    }
    interface PenStroke {
      penWidth: number
    }
    interface Square extends Shape, PenStroke {
      sideLength: number
    }

    let square = <Square>{}
    square.color = 'blue'
    square.sideLength = 10
    square.penWidth = 5.0
  })

  test('Hybrid Types', () => {
    interface Counter {
      (start: number): string
      interval: number
      reset(): void
    }

    function getCounter(): Counter {
      let counter = <Counter> function(start: number) {}
      counter.interval = 123
      counter.reset = () => {}
      return counter
    }

    let c = getCounter()
    c(10)
    c.reset()
    c.interval = 5.0

    expect(typeof c).toBe('function')
    expect(c).toHaveProperty('interval')
    expect(typeof c.reset).toBe('function')
  })

  test('Interfaces Extending Classes', () => {
    class Control {
      private state: any
    }
    interface SelectableControl extends Control {
      select(): void
    }
    class Button extends Control implements SelectableControl {
      select() {}
    }

    class TextBox extends Control {
      select() {}
    }

    // class Image implements SelectableControl {
    //   select() {}
    // }
    // Class 'Image' incorrently implements interface 'SelectableControl'.
  })
})
