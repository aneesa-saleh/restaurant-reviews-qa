import { Restaurant } from "../../models/restaurant";

export interface RestaurantNamesAndCount {
    restaurantsCountFromAPI: number;
    restaurantNamesFromAPI: Set<string>;
}

export class HomePage {
    visit() {
        cy.intercept('/restaurants').as('restaurantsAPIRequest')

        cy.visit('/')
    }

    getMap(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('map')
    }

    getMapPins(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('img.leaflet-marker-icon')
    }

    getRestaurantNamesAndCountFromAPICall(): Cypress.Chainable<RestaurantNamesAndCount> {

        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurantsFromAPI: Array<Restaurant> = interception.response?.body

            const restaurantNamesFromAPI = new Set<string>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            const restaurantsCountFromAPI = restaurantsFromAPI.length

            return { restaurantsCountFromAPI, restaurantNamesFromAPI }
        })
    }
}