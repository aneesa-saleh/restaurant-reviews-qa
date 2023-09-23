import { DetailsPage } from "../support/pages/details-page"
import { HomePage, RestaurantNamesAndCount } from "../support/pages/home-page"

describe('Home page', () => {

    let homePage: HomePage

    beforeEach(() => {
        homePage = new HomePage()
        homePage.visit()
    })

    describe('restaurants map', () => {
        it('renders a map', () => {
                homePage.getMap()
                    .should('be.visible')
                    .and('contain.text', 'Leaflet')
                    .and('contain.text', 'Mapbox')
        })

        it('renders map location pins correctly', () => {
            homePage.getRestaurantNamesAndCountFromAPICall()
                .then(({restaurantsCountFromAPI, restaurantNamesFromAPI } : RestaurantNamesAndCount) => {
                    homePage.getMapPins()
                        .should('have.length', restaurantsCountFromAPI)

                        .each((mapPin) => {
                            const mapPinTitle: string = mapPin.attr('title') || ''

                            expect(mapPinTitle).not.to.be.empty
                            expect(restaurantNamesFromAPI).to.contain(mapPinTitle)
                        })
                })
        })

        it('links to restaurant details page when a pin is clicked', () => {
            const detailsPage: DetailsPage = new DetailsPage()

            homePage.getMapPins()
                .should('have.length.greaterThan', 0)
                .first()
                .then((mapPin) => {
                    const restaurantName = mapPin.attr('title')

                    // need this since we plan on going to a new page
                    cy.unregisterAllServiceWorkers()

                    cy.wrap(mapPin).click()

                    cy.location('pathname')
                        .should('equal', '/restaurant.html')

                    detailsPage.getRestaurantName()
                        .should('have.text', restaurantName)
                })
        })
    })
})