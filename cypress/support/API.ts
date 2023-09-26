import { Restaurant } from "./models/restaurant"

export class APIHelper {
    static interceptRestaurants() {
        cy.intercept('/restaurants').as('restaurantsAPIRequest')
    }

    static getRestaurants(): Cypress.Chainable<Array<Restaurant>> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            return cy.wrap(restaurants)
        })
    }

    static getRestaurantFromAPIById(id: number): Cypress.Chainable<Restaurant | null> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            const restaurant = restaurants.find(restaurant => restaurant.id === id) || null
            return cy.wrap(restaurant)
        })
    }

    static getRestaurantFromAPIByName(name: string): Cypress.Chainable<Restaurant | null> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            const restaurant = restaurants.find(restaurant => restaurant.name === name) || null
            return cy.wrap(restaurant)
        })
    }

    static getRestaurantsCount(): Cypress.Chainable<RestaurantsCount> {

        return APIHelper.getRestaurants().then((restaurantsFromAPI) => {
            const restaurantsCountFromAPI = restaurantsFromAPI.length
            return cy.wrap({ restaurantsCountFromAPI })
        })
    }

    static getRestaurantNamesFromAPI(): Cypress.Chainable<RestaurantNames> {

        return APIHelper.getRestaurants().then((restaurantsFromAPI) => {
            const restaurantNamesFromAPI = new Set<string>()
            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            return cy.wrap({ restaurantNamesFromAPI })
        })
    }

    static getRestaurantNamesAndCountFromAPI(): Cypress.Chainable<RestaurantNamesAndCount> {

        return APIHelper.getRestaurants().then((restaurantsFromAPI) => {

            const restaurantNamesFromAPI = new Set<string>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            const restaurantsCountFromAPI = restaurantsFromAPI.length

            return cy.wrap({ restaurantsCountFromAPI, restaurantNamesFromAPI })
        })
    }

    static mapRestaurantsByName(restaurants: Array<Restaurant>) {
        const restaurantsMap = new Map<string, Restaurant>()

        restaurants.forEach((restaurant: Restaurant) => {
            restaurantsMap.set(restaurant.name, restaurant)
        })

        return restaurantsMap
    }

    static getRestaurantsMappedByName(): Cypress.Chainable<Map<string, Restaurant>> {

        return APIHelper.getRestaurants().then((restaurantsFromAPI) => {
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