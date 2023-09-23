import { Interception } from "cypress/types/net-stubbing"

import { Restaurant } from "../models/restaurant"

describe('Home page', () => {

    beforeEach(() => {
        cy.intercept('/restaurants').as('restaurantsJson')
        cy.visit('/')
    })

    describe('restaurants map', () => {
        it('renders a map', () => {
            cy.getById('map')
                .should('be.visible')
                .and('contain.text', 'Leaflet')
                .and('contain.text', 'Mapbox')
        })

        it('renders map location pins correctly', () => {
            cy.wait('@restaurantsJson').then((interception: Interception) => {
                const restaurantsFromAPI: Array<Restaurant> = interception.response?.body;

                const restaurantNamesFromAPI = new Set<string>()

                restaurantsFromAPI.forEach((restaurant: Restaurant) => {
                    restaurantNamesFromAPI.add(restaurant.name)
                })

                const restaurantsCountFromAPI = restaurantsFromAPI.length
                cy.get('img.leaflet-marker-icon').as('mapPins')
                    .should('have.length', restaurantsCountFromAPI)
    
                cy.get('@mapPins').each((mapPin: JQuery<HTMLElement>) => {
                    const mapPinTitle = mapPin.attr('title') || ''
                    
                    expect(mapPinTitle).not.to.be.empty
                    expect(restaurantNamesFromAPI.has(mapPinTitle)).to.be.true
                })
            })
        })

        it('links to restaurant details page when a pin is clicked')
    })
})