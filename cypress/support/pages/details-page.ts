export class DetailsPage {
    getLocationPathname(): string {
        return '/restaurant.html'
    }

    getRestaurantName(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-name')
    }
}