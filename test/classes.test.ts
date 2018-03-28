describe('Classes', () => {
  test('simple class-based', () => {
    class Greeter {
      greeting: string
      constructor(message: string) {
        this.greeting = message
      }
      greet() {
        return `Hello, ${this.greeting}`
      }
    }
    const greeter = new Greeter('World')

    expect(greeter).toBeInstanceOf(Greeter)
    expect(greeter).toHaveProperty('greeting')

    expect(greeter.greeting).toBe('World')
    expect(greeter.greet()).toBe('Hello, World')

    greeter.greeting = 'Gz'
    expect(greeter.greet()).toBe('Hello, Gz')
  })

  test('Inheritance', () => {
    class Animal {
      name: string
      constructor(theName: string) { this.name = theName }
      move(distanceInMeters: number = 0): string {
        return `${this.name} moved ${distanceInMeters}m.`
      }
    }
    class Dog extends Animal {
      bark(): string {
        return 'Woof! Woof!'
      }
    }
    const dog = new Dog('Bow')
    expect(dog.bark()).toBe('Woof! Woof!')
    expect(dog.move(10)).toBe('Bow moved 10m.')
    expect(dog.bark()).toBe('Woof! Woof!')

    class Snake extends Animal {
      move(distanceInMeters: number = 5): string {
        return super.move(distanceInMeters)
      }
    }
    let sam: Animal = new Snake('Sammy the Python')
    expect(sam.move()).toBe('Sammy the Python moved 5m.')
  })

  test('Public by default', () => {
    // typescript에서 class member들은 기본적으로 명시하지 않을 경우 public이다.
    class Animal {
      public name: string
      public constructor(theName: string) { this.name = theName}
    }
    expect(Animal).toHaveProperty('name')
  })

  test('Understanding private', () => {
    class Animal {
      private name: string
      constructor(theName: string) { this.name = theName }
      getName() { return this.name }
    }
    // new Animal('Cat').name
    // Property 'name' is private and only accessible within class 'Animal'.

    class Rhino extends Animal {
      constructor() { super('Rhino') }
    }

    class Employee {
      private name: string
      constructor(theName: string) { this.name = theName }
    }

    let animal = new Animal('Goat')
    let rhino = new Rhino()
    let employee = new Employee('Bob')

    expect(animal.getName()).toBe('Goat')

    animal = rhino
    expect(animal.getName()).toBe('Rhino')

    // animal = employee
    // Type 'Employee' is not assignable to type 'Animal'.
  })

  test('Understanding protected', () => {
    class Person {
      protected name: string
      constructor(name: string) { this.name = name}
    }
    class Employee extends Person {
      private department: string
      constructor(name: string, department: string) {
        super(name)
        this.department = department
      }
      public getElevatorPitch() {
        return `Hello, my name is ${this.name} and i work in ${this.department}.`
      }
    }
    let howard = new Employee('Howard', 'Sales')
    expect(howard.getElevatorPitch()).toBe('Hello, my name is Howard and i work in Sales.')
    // howard.name
    // Property 'name' is protected and only accessible within class 'Person' and its subclasses.
  })

  test('Readonly modifier', () => {
    class Octopus {
      readonly numberOfLegs: number = 8
      constructor(readonly name: string){} // == name:string; constructor(name: string) {this.name = name}
      // 생성자 파라메터에서 접근지정자를 사용하면 선언되고 초기화 된다.
    }
    let dad = new Octopus('Man with the 8 strong legs')
    // dad.name = 'Man with the 3-piece suit'
    // Cannot assign to 'name' because it is a constant or a read-only property.
  })

  /**
   * Accessors are only available when targeting ECMAScript 5 and higher.
   */
  test('Accessors', () => {
    let passcode = 'secret passcode'
    class Employee {
      private _fullName: string

      get fullName(): string {
        return this._fullName
      }

      set fullName(newName: string) {
        if (passcode && passcode == 'secret passcode') {
          this._fullName = newName
        } else {
          throw new Error('Unauthorized')
        }
      }
    }
    let employee = new Employee()

    employee.fullName = 'Bob Smith'
    expect(employee.fullName).toBe('Bob Smith')

    passcode = ''
    expect(() => {
      employee.fullName = 'Alex'
    }).toThrowError('Unauthorized')
    expect(employee.fullName).not.toBe('Alex')
  })

  test('Static Properties', () => {
    class Grid {
      static origin = {x: 0, y: 0}
      constructor(public scale: number) {}
      calculateDistanceFromOrigin(point: {x: number, y: number}) {
        const xDist = (point.x - Grid.origin.x)
        const yDist = (point.y - Grid.origin.y)
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale
      }
    }
    let grid1 = new Grid(1.0) // 1x scale
    let grid2 = new Grid(5.0) // 5x scale

    expect(grid1.calculateDistanceFromOrigin({x: 10, y: 10}).toFixed(1)).toBe('14.1')
    expect(grid2.calculateDistanceFromOrigin({x: 10, y: 10}).toFixed(1)).toBe('2.8')
  })

  test('Abstract Classes', () => {
    abstract class Department {
      constructor(public name: string) {}

      printName(): string {
        return `Department name: ${this.name}`
      }

      abstract printMeeting(): string // must be implemented in derived classes
    }

    class AccountingDepartment extends Department {
      constructor() {
        super('Accounting and Auditing')
      }

      printMeeting(): string {
        return 'The Accounting Department meets each monday at 10am.'
      }

      generateReports(): string {
        return 'Generating accounting reports...'
      }
    }

    let department: Department
    // department = new Department()
    // Cannot create an instance of an abstract class.
    department = new AccountingDepartment()
    expect(department.name).toBe('Accounting and Auditing')

    // department.generateReports()
    // Property 'generateReports' does not exist on type 'Department'.
  })

  test('Advanced Techniques', () => {
    class Greeter {
      static standardGreeting = 'Hello, there'
      greeting: string
      greet() {
        return this.greeting
          ? `Hello, ${this.greeting}`
          : Greeter.standardGreeting
      }
    }

    let greeter1: Greeter
    greeter1 = new Greeter()
    expect(greeter1.greet()).toBe('Hello, there')

    greeter1.greeting = 'guys'
    expect(greeter1.greet()).toBe('Hello, guys')

    let greeterMaker: typeof Greeter = Greeter
    greeterMaker.standardGreeting = 'Hey there!'
    let greeter2: Greeter = new greeterMaker()
    expect(greeter2.greet()).toBe('Hey there!')

    expect(Greeter.standardGreeting).toBe('Hey there!')
  })

  test('Using a class as an interface', () => {
    class Point {
      x: number
      y: number
    }

    interface Point3D extends Point {
      z: number
    }

    let point3d: Point3D = {x: 1, y: 2, z: 3}
  })
})
