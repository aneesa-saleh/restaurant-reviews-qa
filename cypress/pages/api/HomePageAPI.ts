import { Restaurant } from "../../support/models/restaurant"

export class HomePageAPI {
    constructor() {
        this.interceptRestaurants()
    }
    
    interceptRestaurants() {
        cy.intercept('/restaurants').as('restaurantsAPIRequest')
    }

    getRestaurants(): Cypress.Chainable<Array<Restaurant>> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            return cy.wrap(restaurants)
        })
    }

    getRestaurantsCount(): Cypress.Chainable<RestaurantsCount> {

        return this.getRestaurants().then((restaurantsFromAPI) => {
            const restaurantsCountFromAPI = restaurantsFromAPI.length
            return cy.wrap({ restaurantsCountFromAPI })
        })
    }

    getRestaurantNames(): Cypress.Chainable<RestaurantNames> {

        return this.getRestaurants().then((restaurantsFromAPI) => {
            const restaurantNamesFromAPI = new Set<string>()
            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            return cy.wrap({ restaurantNamesFromAPI })
        })
    }

    getRestaurantNamesAndCount(): Cypress.Chainable<RestaurantNamesAndCount> {

        return this.getRestaurants().then((restaurantsFromAPI) => {

            const restaurantNamesFromAPI = new Set<string>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            const restaurantsCountFromAPI = restaurantsFromAPI.length

            return cy.wrap({ restaurantsCountFromAPI, restaurantNamesFromAPI })
        })
    }

    mapRestaurantsByName(restaurants: Array<Restaurant>) {
        const restaurantsMap = new Map<string, Restaurant>()

        restaurants.forEach((restaurant: Restaurant) => {
            restaurantsMap.set(restaurant.name, restaurant)
        })

        return restaurantsMap
    }

    getRestaurantsMappedByName(): Cypress.Chainable<Map<string, Restaurant>> {

        return this.getRestaurants().then((restaurantsFromAPI) => {
            const restaurantsMap = this.mapRestaurantsByName(restaurantsFromAPI)

            return cy.wrap(restaurantsMap)
        })
    }
}

export type RestaurantNamesAndCount = {
    restaurantsCountFromAPI: number;
    restaurantNamesFromAPI: Set<string>;
}

export type RestaurantNames = Pick<RestaurantNamesAndCount, 'restaurantNamesFromAPI'>

export type RestaurantsCount = Pick<RestaurantNamesAndCount, 'restaurantsCountFromAPI'>