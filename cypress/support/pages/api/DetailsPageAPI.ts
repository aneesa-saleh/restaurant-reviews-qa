import { Restaurant } from "../../models/restaurant"

export class DetailsPageAPI {
    constructor() {
        this.interceptRestaurantDetails()
    }

    interceptRestaurantDetails() {
        cy.intercept('/restaurants/*').as('restaurantDetailsAPIRequest')
    }

    getRestaurantDetails(): Cypress.Chainable<Restaurant> {
        return cy.wait('@restaurantDetailsAPIRequest').then((interception) => {
            const restaurant: Restaurant = interception.response?.body
            return cy.wrap(restaurant)
        })
    }
}