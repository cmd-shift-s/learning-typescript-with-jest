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
})
