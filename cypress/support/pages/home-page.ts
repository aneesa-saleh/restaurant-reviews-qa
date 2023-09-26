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

    getRestaurantArticles(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#restaurants-list article')
    }

    getNameOfRestaurantArticle(article: JQuery<HTMLElement>): string {
            return article.find('h2').text()
    }

    getElementsOfRestaurantArticle(article: JQuery<HTMLElement>): RestaurantArticle {
            
            const nameElement = cy.wrap(article).find('h2')
            const imageElement = cy.wrap(article).find('img')
            const neighborhoodElement = cy.wrap(article)
                .find('p')
                .first()

            const addressElement = cy.wrap(article)
                .find('p')
                .eq(1)

            const viewDetailsLinkElement = cy.wrap(article)
                .find('a')

            return {
                nameElement,
                imageElement,
                neighborhoodElement,
                addressElement,
                viewDetailsLinkElement
            }
    }

    /* UI actions */

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

    clickFirstViewDetailsLink(): Cypress.Chainable<MapPin> {
        // need this since we plan on going to a new page
        // when we click the map pin
        cy.unregisterAllServiceWorkers()

        return this.getRestaurantArticles()
            .should('have.length.greaterThan', 0)
            .first()
            .then((article) => {
                const restaurantName = article.find('h2').text()
                
                cy.wrap(article)
                    .find('a')
                    .contains('View Details')
                    .click()

                return cy.wrap({ restaurantName })
            })
    }

    selectNeighborhood(neighborhood: Neighborhoods) {
        cy.getById('neighborhoods-select').select(neighborhood)
    }

    selectCuisine(cuisine: Cuisines) {
        cy.getById('cuisines-select').select(cuisine)
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

export interface RestaurantNamesAndCount {
    restaurantsCountFromAPI: number;
    restaurantNamesFromAPI: Set<string>;
}

export type RestaurantNames = Pick<RestaurantNamesAndCount, 'restaurantNamesFromAPI'>

export type RestaurantsCount = Pick<RestaurantNamesAndCount, 'restaurantsCountFromAPI'>

export interface MapPin {
    restaurantName: string;
}

export interface RestaurantArticle {
    nameElement: Cypress.Chainable<JQuery<HTMLHeadingElement>>;
    imageElement: Cypress.Chainable<JQuery<HTMLImageElement>>;
    neighborhoodElement: Cypress.Chainable<JQuery<HTMLParagraphElement>>;
    addressElement: Cypress.Chainable<JQuery<HTMLElement>>;
    viewDetailsLinkElement: Cypress.Chainable<JQuery<HTMLAnchorElement>>;
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