/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { homePageSelectors } from '../support/selectors/homePageSelectors'

Cypress.Commands.add('addTodo', (text) => {
    cy.get(homePageSelectors.newTodoInput).clear().type(text)
    cy.get(homePageSelectors.addButton).click()
})

Cypress.Commands.add('verifyTODOsCount', (expectedCount: number) => {
    cy.get(homePageSelectors.todoItems).should('have.length', expectedCount)
  })
  
Cypress.Commands.add('verifyTodoTextAt', (index: number, expectedText: string) => {
    cy.get(homePageSelectors.todoItemInput(index)).should('have.value', expectedText)
})

Cypress.Commands.add('deleteTodoAt', (index: number) => {
    cy.get(homePageSelectors.deleteButton(index)).click()
})

Cypress.Commands.add('editTodoAt', (index: number, newText: string) => {
    cy.get(homePageSelectors.todoItemInput(index))
      .clear()
      .type(newText)
  })