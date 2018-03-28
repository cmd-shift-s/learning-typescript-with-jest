
describe('Functions', () => {
  test('Functions', () => {
    // Named functions
    function add(x, y) {
      return x + y
    }
    expect(add(1, 2)).toBe(3)

    // Anonymous function
    let myAdd = function(x, y) { return x + y}
    expect(myAdd(1, 2)).toBe(3)

    // capture
    let z = 100
    function addToZ(x, y) {
      return x + y + z
    }
    expect(addToZ(1, 2)).toBe(103)
  })

  test('Function Types', () => {
    // full function type
    let myAdd1: (x: number, y: number) => number =
      function(x: number, y: number): number { return x + y}

    // inferring the types
    let myAdd2: (baseValue: number, increment: number) => number =
      function(x, y) { return x + y }
  })

  test('Optional and Default Parameters', () => {
    {
      function buildName1(firstName: string, lastName: string) {
        return `${firstName} ${lastName}`
      }
      // let result = buildName1('Bob') // Expected 2 arguments. but got 1.
      // let result = buildName1('Bob', 'Adams', 'Sr.') // Expected 2 arguemtns, but got 3
      let result = buildName1('Bob', 'Adams')
      expect(result).toBe('Bob Adams')
    }
    {
      function buildName2(firstName: string, lastName = 'Smith') {
        return `${firstName} ${lastName}`
      }

      // let result = buildName2('Bob', 'Adams', 'Sr.') // Expected 1-2 arguemtns, but got 3.

      let result1 = buildName2('Bob')
      expect(result1).toBe('Bob Smith')

      let result2 = buildName2('Bob', undefined)
      expect(result2).toBe('Bob Smith')

      let result3 = buildName2('Bob', 'Adams')
      expect(result3).toBe('Bob Adams')
    }
    {
      function buildName3(firstName = 'Will', lastName: string) {
        return `${firstName} ${lastName}`
      }
      // let result = buildName3('Bob') // Expected 2 arguments, but got 1
      // let result = buildName2('Bob', 'Adams', 'Sr.') // Expected 2 arguemtns, but got 3.
      let result1 = buildName3('Bob', 'Adams')
      expect(result1).toBe('Bob Adams')

      let result2 = buildName3(undefined, 'Adams')
      expect(result2).toBe('Will Adams')
    }
  })

  test('Rest Parameters', () => {
    function buildName(firstName: string, ...restOfName: string[]) {
      return `${firstName} ${restOfName.join(' ')}`
    }
    let employee = buildName('Joseph', 'Samuel', 'Lucas', 'MacKinzie')
    expect(employee).toBe('Joseph Samuel Lucas MacKinzie')
  })

  describe('This', () => {
    test('Arrow functions', () => {
      {
        let deck = {
          suits: ['hearts', 'spades', 'clubs', 'diamonds'],
          cards: Array(52),
          createCardPicker: function() {
            return function() {
              let pickedCard = Math.floor(Math.random() * 52)
              let pickedSuit = Math.floor(pickedCard / 13)
              return {
                // --noImplicitThis 옵션을 키면 아래 구문은 에러로 표시된다.
                suit: this.suits[pickedSuit],
                card: pickedCard % 13
              }
            }
          }
        }
        let cardPicker = deck.createCardPicker()
        expect(() => {
          let pickedCard = cardPicker()
        }).toThrowError(/^Cannot read property '\d+' of undefined$/)
      }
      {
        let deck = {
          suits: ['hearts', 'spades', 'clubs', 'diamonds'],
          cards: Array(52),
          createCardPicker: function() {
            return () => {
              let pickedCard = Math.floor(Math.random() * 52)
              let pickedSuit = Math.floor(pickedCard / 13)
              return {
                suit: this.suits[pickedSuit],
                card: pickedCard % 13
              }
            }
          }
        }
        let cardPicker = deck.createCardPicker()
        let pickedCard = cardPicker()
        expect(pickedCard).toHaveProperty('suit')
        expect(pickedCard).toHaveProperty('card')
        expect(deck.suits).toContain(pickedCard.suit)
      }
    })

    test('Parameters', () => {
      interface Card {
        suit: string
        card: number
      }
      interface Deck {
        suits: string[]
        cards: number[]
        createCardPicker(this: Deck): () => Card
      }
      let deck: Deck = {
        suits: ['hearts', 'spades', 'clubs', 'diamonds'],
        cards: Array(52),
        createCardPicker: function() {
          return () => {
            let pickedCard = Math.floor(Math.random() * 52)
            let pickedSuit = Math.floor(pickedCard / 13)
            return {
              // --noImplicitThis 옵션을 켜도 에러로 잡히지 않는다.
              suit: this.suits[pickedSuit],
              card: pickedCard % 13
            }
          }
        }
      }
      let cardPicker = deck.createCardPicker()
      let pickedCard = cardPicker()
      expect(deck.suits).toContain(pickedCard.suit)
    })

    test('Parameters in callbacks', () => {
      interface UIElement {
        // onclick function에서 this가 필요하지 않다고 명시
        addClickListener(onclick: (this: void, e: Event) => void): void
      }

      class Handler {
        info: string
        onClickBad(this: Handler, e: Event) {
          this.info = e.type
        }
        onClickGood(this: void, e: Event) {
          return 'Clicked'
        }
      }

      let uiElement: UIElement = {
        addClickListener(onclick): void {}
      }
      let h = new Handler()
      // uiElement.addClickListener(h.onClickBad)
      // The 'this' types of each signature are incompatible.
      uiElement.addClickListener(h.onClickGood)
    })
  })
})
