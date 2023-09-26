import { Restaurant } from "./models/restaurant"

export class API {
    getRestaurantsFromAPI(): Cypress.Chainable<Array<Restaurant>> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            return cy.wrap(restaurants)
        })
    }

    getRestaurantsCountFromAPI(): Cypress.Chainable<RestaurantsCount> {

        return this.getRestaurantsFromAPI().then((restaurantsFromAPI) => {
            const restaurantsCountFromAPI = restaurantsFromAPI.length
            return cy.wrap({ restaurantsCountFromAPI })
        })
    }

    getRestaurantNamesFromAPI(): Cypress.Chainable<RestaurantNames> {

        return this.getRestaurantsFromAPI().then((restaurantsFromAPI) => {
            const restaurantNamesFromAPI = new Set<string>()
            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            return cy.wrap({ restaurantNamesFromAPI })
        })
    }

    getRestaurantNamesAndCountFromAPI(): Cypress.Chainable<RestaurantNamesAndCount> {

        return this.getRestaurantsFromAPI().then((restaurantsFromAPI) => {

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

        return this.getRestaurantsFromAPI().then((restaurantsFromAPI) => {
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