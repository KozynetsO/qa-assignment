import { homePageSelectors } from '../support/selectors/homePageSelectors'

describe('TODO Add Tests', () => {
  
  beforeEach(() => {
    cy.visit('/')
  })
  
  it('Should add TODOs test', () => {
    const todos = ['Buy milk', 'Buy food', 'Buy fruits']

    todos.forEach((todoText, index) => {
      cy.addTodo(todoText)

      cy.verifyTODOsCount(index + 1)

      for (let i = 0; i <= index; i++) {
        cy.verifyTodoTextAt(i, todos[i])
      }
    })
  })

  it('Should not add empty or space TODO', () => {
    cy.get(homePageSelectors.addButton).click()
    cy.verifyTODOsCount(0)

    let todoText = "Buy milk"
    cy.addTodo(todoText)
    cy.verifyTODOsCount(1)
    cy.verifyTodoTextAt(0, todoText)

    cy.addTodo(" ")
    cy.verifyTODOsCount(1)
    cy.verifyTodoTextAt(0, todoText)
  })

  it('Should add TODO with special characters', () => {
    let todoText = "!@#$%^&*()"
    cy.addTodo(todoText)
    cy.verifyTODOsCount(1)
    cy.verifyTodoTextAt(0, todoText)  
  })

  it('Should add TODO with emojy', () => {
    let todoText = "🛒 Byu food"
    cy.addTodo(todoText)
    cy.verifyTODOsCount(1)
    cy.verifyTodoTextAt(0, todoText)  
  })

  it('Should add TODO when previous removed', () => {
    let todoText = "Buy milk"
    cy.addTodo(todoText)

    cy.deleteTodoAt(0)
    cy.verifyTODOsCount(0)

    todoText = "Buy food"
    cy.addTodo(todoText)
    cy.verifyTODOsCount(1)
    cy.verifyTodoTextAt(0, todoText)  
  })

  describe('TODO Edit Tests', () => {
    it('Should edit multiple TODOs', () => {
      const todos = ['Buy milk', 'Buy food', 'Buy fruits']
      todos.forEach(todo => cy.addTodo(todo))
  
      todos[2] = 'Third'
      cy.editTodoAt(2, todos[2])

      todos[0] = 'First'
      cy.editTodoAt(0, todos[0])

      todos[1] = 'Second'
      cy.editTodoAt(1, todos[1])

      todos.forEach((text, index) => {
        cy.verifyTodoTextAt(index, text)
      })
    })

    //this test fails now because the field is empty after editing. This is an issue
    it('Should not edit TODO to empty or space', () => {
      let todo = 'Buy milk'
      cy.addTodo(todo)
  
      cy.get(homePageSelectors.todoItemInput(0))
        .clear()
        .blur()
  
      cy.verifyTodoTextAt(0, todo)
    })
  })
 

  describe('TODO Remove Tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Should delete TODOs', () => {
      const todos = ['Buy milk', 'Buy food', 'Buy fruits']
      todos.forEach((todo) => cy.addTodo(todo))
  
      cy.deleteTodoAt(2)
      cy.verifyTODOsCount(2)
      cy.verifyTodoTextAt(0, todos[0])
      cy.verifyTodoTextAt(1, todos[1])
  
      cy.deleteTodoAt(0)
      cy.verifyTODOsCount(1)
      cy.verifyTodoTextAt(0, todos[1])
  
      cy.deleteTodoAt(0)
      cy.verifyTODOsCount(0)
    })
  })
})