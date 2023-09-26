import { Restaurant } from "../../models/restaurant";

export class HomePage {
    constructor() {
        this.visit()
    }

    private visit() {
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

    getRestaurants(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#restaurants-list article')
    }

    getNameOfRestaurantFromElement(restaurantElement: JQuery<HTMLElement>): string {
        return restaurantElement.find('h2').text()
    }

    getNameElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('h2')
    }

    getImageElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('img')
    }

    getNaighborhoodElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement
            .find('p')
            .first()
    }

    getAddressElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement
            .find('p')
            .eq(1)
    }

    getViewDetailsElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('a')
    }

    getElementsOfRestaurant(restaurantElement: JQuery<HTMLElement>): ElementsOfRestaurant {
            
            const nameElement = this.getNameElementOfRestaurant(restaurantElement)
            const imageElement = this.getImageElementOfRestaurant(restaurantElement)
            const neighborhoodElement = this.getNaighborhoodElementOfRestaurant(restaurantElement)
            const addressElement = this.getAddressElementOfRestaurant(restaurantElement)
            const viewDetailsLinkElement = this.getViewDetailsElementOfRestaurant(restaurantElement)

            return {
                nameElement,
                imageElement,
                neighborhoodElement,
                addressElement,
                viewDetailsLinkElement
            }
    }

    getNeighborhoodSelect(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('neighborhoods-select')
    }

    getCuisineSelect(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('cuisines-select')
    }

    /* UI actions */

    clickMapPin(index: number): Cypress.Chainable<MapPin> {
        // need this since we plan on going to a new page
        // when we click the map pin
        cy.unregisterAllServiceWorkers()

        return this.getMapPins()
            // first make sure a map pin exists at that index, otherwise fail the test
            .should('have.length.greaterThan', index)
            .eq(index)
            .then((mapPin) => {
                const title = mapPin.attr('title')

                cy.wrap(mapPin).click()

                return cy.wrap({ title })
            })
    }

    clickViewDetailsLink(index: number): Cypress.Chainable<ViewDetailsLink> {
        // need this since we plan on going to a new page
        // when we click the link
        cy.unregisterAllServiceWorkers()

        return this.getRestaurants()
            .should('have.length.greaterThan', index)
            .eq(index)
            .then((restaurantElement) => {
                const restaurantName = this.getNameOfRestaurantFromElement(restaurantElement)

                cy.wrap(this.getViewDetailsElementOfRestaurant(restaurantElement))
                    .click()

                return cy.wrap({ restaurantName })
            })
    }

    selectNeighborhood(neighborhood: Neighborhoods) {
        this.getNeighborhoodSelect()
            .select(neighborhood)
    }

    selectCuisine(cuisine: Cuisines) {
        this.getCuisineSelect()
            .select(cuisine)
    }

    resetFilters() {
        this.selectNeighborhood(Neighborhoods.AllNeighborhoods)
        this.selectCuisine(Cuisines.AllCuisines)
    }

    filterRestaurantsByNeighborhood(neighborhood: Neighborhoods): Cypress.Chainable<Set<string>> {
        this.selectNeighborhood(neighborhood)
        
        return this.getRestaurantsFromAPICall().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>
            restaurants.filter(restaurant => restaurant.neighborhood === neighborhood)
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name)
                })
                
            return cy.wrap(filteredRestaurants)
        })
    }

    filterRestaurantsByCuisine(cuisine: Cuisines): Cypress.Chainable<Set<string>> {
        this.selectCuisine(cuisine)

        return this.getRestaurantsFromAPICall().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>
            restaurants.filter(restaurant => restaurant.cuisine_type === cuisine)
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name)
                })
                
            return cy.wrap(filteredRestaurants)
        })
    }

    filterRestaurantsByNeighborhoodAndCuisine(neighborhood: Neighborhoods, cuisine: Cuisines): Cypress.Chainable<Set<string>> {
        this.selectNeighborhood(neighborhood)
        this.selectCuisine(cuisine)

        return this.getRestaurantsFromAPICall().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>
            restaurants.filter(
                    restaurant => restaurant.cuisine_type === cuisine && restaurant.neighborhood === neighborhood
                )
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name)
                })
                
            return cy.wrap(filteredRestaurants)
        })
    }

    /* API */

    getRestaurantsFromAPICall(): Cypress.Chainable<Array<Restaurant>> {
        return cy.wait('@restaurantsAPIRequest').then((interception) => {
            const restaurants: Array<Restaurant> = Array.from(interception.response?.body)
            return cy.wrap(restaurants)
        })
    }

    getRestaurantsCountFromAPICall(): Cypress.Chainable<RestaurantsCount> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
            const restaurantsCountFromAPI = restaurantsFromAPI.length
            return cy.wrap({ restaurantsCountFromAPI })
        })
    }

    getRestaurantNamesFromAPICall(): Cypress.Chainable<RestaurantNames> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
            const restaurantNamesFromAPI = new Set<string>()
            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantNamesFromAPI.add(restaurant.name)
            })

            return cy.wrap({ restaurantNamesFromAPI })
        })
    }

    getRestaurantNamesAndCountFromAPICall(): Cypress.Chainable<RestaurantNamesAndCount> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {

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

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
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

export type MapPin = {
    title: string
}

export type ViewDetailsLink = {
    restaurantName: string
}

export type ElementsOfRestaurant = {
    nameElement: JQuery<HTMLElement>;
    imageElement: JQuery<HTMLElement>;
    neighborhoodElement: JQuery<HTMLElement>;
    addressElement: JQuery<HTMLElement>;
    viewDetailsLinkElement: JQuery<HTMLElement>;
}

export enum Neighborhoods {
    Manhattan = 'Manhattan',
    Brooklyn = 'Brooklyn',
    Queens = 'Queens',
    AllNeighborhoods = 'All Neighborhoods',
}

export enum Cuisines {
    Asian = 'Asian',
    Pizza = 'Pizza',
    American = 'American',
    Mexican = 'Mexican',
    AllCuisines = 'All Cuisines',
}