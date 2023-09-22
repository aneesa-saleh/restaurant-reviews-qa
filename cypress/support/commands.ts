declare namespace Cypress {
    interface Chainable {
        getById(id: string): Chainable<JQuery<HTMLElement>>
        getByClass(className: string): Chainable<JQuery<HTMLElement>>
    }
}

Cypress.Commands.add('getById', (id: string) => {
    return cy.get(`#${id}`)
})

Cypress.Commands.add('getByClass', (className: string) => {
    return cy.get(`.${className}`)
})