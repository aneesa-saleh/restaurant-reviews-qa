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

    getElementsOfRestaurantArticle(article: JQuery<HTMLElement>, restaurantsByName: Map<string, Restaurant>):
        Cypress.Chainable<RestaurantArticle> {
            
            const restaurantName = article.find('h2').text()
            expect(restaurantName).not.to.be.null

            const restaurant: Restaurant = restaurantsByName.get(restaurantName)
            expect(restaurant).not.to.be.null
        
            const { alt, neighborhood, address } = restaurant;

            const imageElement = cy.wrap(article.find(`img[data-alt="${alt}"]`))
            
            const neighborhoodElement = cy.wrap(article)
                .find('p')
                .contains((new RegExp(`^${neighborhood}$`, 'g')))

            const addressElement = cy.wrap(article)
                .find('p')
                .contains((new RegExp(`^${address}$`, 'g')))

            const viewDetailsElement = cy.wrap(article)
                .find('a')
                .contains('View Details')

            const nameElement = cy.wrap(article.find('h2'))

            return cy.wrap({
                name: nameElement,
                image: imageElement,
                neighborhood: neighborhoodElement,
                address: addressElement,
                viewDetailsLink: viewDetailsElement
            })
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

    getRestaurantsMappedByName(): Cypress.Chainable<Map<string, Restaurant>> {

        return this.getRestaurantsFromAPICall().then((restaurantsFromAPI) => {
            const restaurantsMap = new Map<string, Restaurant>()

            restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                restaurantsMap.set(restaurant.name, restaurant)
            })

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
    name: Cypress.Chainable<JQuery<HTMLElement>>;
    image: Cypress.Chainable<JQuery<HTMLElement>>;
    neighborhood: Cypress.Chainable<JQuery<HTMLParagraphElement>>;
    address: Cypress.Chainable<JQuery<HTMLParagraphElement>>;
    viewDetailsLink: Cypress.Chainable<JQuery<HTMLAnchorElement>>;
}