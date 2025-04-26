export const homePageSelectors = {
    newTodoInput: 'div > input:first-of-type',
    addButton: 'div > button:contains("Add")',
  
    todoList: 'ul',
    todoItems: 'ul > li',
  
    todoItemInput: (index) => `ul > li:eq(${index}) input`,
    deleteButton: (index) => `ul > li:eq(${index}) button`,
  }