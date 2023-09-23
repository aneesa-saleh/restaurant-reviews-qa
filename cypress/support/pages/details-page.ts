export class DetailsPage {
    getRestaurantName(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-name')
    }
}