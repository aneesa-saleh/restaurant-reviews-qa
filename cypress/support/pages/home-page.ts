import { Restaurant } from "../../models/restaurant";

export class HomePage {
    visit() {
        cy.intercept('/restaurants').as('restaurantsAPIRequest')

        cy.visit('/')
    }

    /* locators */

    getMap(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('map')
    }

    getMapPins(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('img.leaflet-marker-icon')
    }

    getRestaurantArticles(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#restaurants-list article')
    }

    /* actions */

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

    /* API */

    getRestaurantsFromAPICall(): Cypress.Chainable<Array<Restaurant>> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            return interception.response?.body
        })
    }

    getRestaurantsCountFromAPICall(): Cypress.Chainable<RestaurantsCount> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
            const restaurantsCountFromAPI = restaurantsFromAPI.length
            return { restaurantsCountFromAPI }
        })
    }

    getRestaurantNamesFromAPICall(): Cypress.Chainable<RestaurantNames> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
            const restaurantNamesFromAPI = new Set<string>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            return { restaurantNamesFromAPI }
        })
    }

    getRestaurantNamesAndCountFromAPICall(): Cypress.Chainable<RestaurantNamesAndCount> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {

            const restaurantNamesFromAPI = new Set<string>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            const restaurantsCountFromAPI = restaurantsFromAPI.length

            return { restaurantsCountFromAPI, restaurantNamesFromAPI }
        })
    }
}

export interface RestaurantNamesAndCount {
    restaurantsCountFromAPI: number;
    restaurantNamesFromAPI: Set<string>;
}

export type RestaurantNames = Pick<RestaurantNamesAndCount, 'restaurantNamesFromAPI'>

export type RestaurantsCount = Pick<RestaurantNamesAndCount, 'restaurantsCountFromAPI'>

export interface MapPin {
    restaurantName: string;
}