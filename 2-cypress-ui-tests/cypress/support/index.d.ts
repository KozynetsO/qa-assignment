declare global {
    namespace Cypress {
      interface Chainable {
        addTodo(text: string): Chainable<void>
        verifyTODOsCount(count: number): Chainable<void>
        verifyTodoTextAt(index: number, text: string): Chainable<void>
        deleteTodoAt(index: number): Chainable<void>
        editTodoAt(index: number, newText: string): Chainable<void>
      }
    }
  }
  
  export {}