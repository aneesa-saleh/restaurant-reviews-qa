import { Restaurant } from "../../models/restaurant";

export interface RestaurantNamesAndCount {
    restaurantsCountFromAPI: number;
    restaurantNamesFromAPI: Set<string>;
}

export interface MapPin {
    restaurantName: string;

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

    clickFirstMapPin(): Cypress.Chainable<MapPin> {
        // need this since we plan on going to a new page
        // when we click the map pin
        cy.unregisterAllServiceWorkers()

        return this.getMapPins()
            .should('have.length.greaterThan', 0)
            .first()
            .then((mapPin) => {
                const restaurantName = mapPin.attr('title') || ''

                cy.wrap(mapPin).click()

                return cy.wrap({ restaurantName })
            })
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