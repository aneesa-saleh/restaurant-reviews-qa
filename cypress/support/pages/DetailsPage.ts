import { DetailsPageAPI } from "../api/DetailsPageAPI";

export class DetailsPage {

    API: DetailsPageAPI

    constructor() {
        this.API = new DetailsPageAPI()
    }

    getLocationPathname(): string {
        return '/restaurant.html'
    }

    getRestaurantName(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-name')
    }
}