import { Restaurant } from "../models/restaurant"
import { DetailsPage } from "../support/pages/details-page"
import { HomePage, RestaurantArticle, RestaurantNamesAndCount } from "../support/pages/home-page"

describe('Home page', () => {

    let homePage: HomePage

    beforeEach(() => {
        homePage = new HomePage()
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

            homePage.clickFirstMapPin()
                .then(({ restaurantName }) => {
                    cy.location('pathname')
                        .should('equal', detailsPage.getLocationPathname())

                    detailsPage.getRestaurantName()
                        .should('have.text', restaurantName)
                })
        })
    })

    describe('list of restaurants', () => {
        it('shows the correct number of restaurants', () => {
            homePage.getRestaurantsCountFromAPICall()
                .then(({ restaurantsCountFromAPI }) => {
                    homePage.getRestaurantArticles()
                        .should('have.length', restaurantsCountFromAPI)
                })
        })

        it('shows a complete summary of each restaurant', () => {
            homePage.getRestaurantsMappedByName()
                .then((restaurantsByName) => {
                    homePage.getRestaurantArticles().each(
                        (article) => homePage.getElementsOfRestaurantArticle(article, restaurantsByName)
                        .then(({ name, image, neighborhood, address, viewDetailsLink }: RestaurantArticle) => {

                            name.should('have.length', 1)
                            image.should('have.length', 1)
                            neighborhood.should('have.length', 1)
                            address.should('have.length', 1)
                            viewDetailsLink.should('have.length', 1)

                        })
                    )
                })
        })

        it('links to restaurant details page when view details link is clicked')
    })
})