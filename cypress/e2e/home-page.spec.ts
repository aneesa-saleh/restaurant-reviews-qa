import { Restaurant } from "../models/restaurant"
import { DetailsPage } from "../support/pages/details-page"
import { Cuisines, HomePage, Neighborhoods, RestaurantArticle, RestaurantNamesAndCount } from "../support/pages/home-page"

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
                        (article) => {
                            const {
                                nameElement, imageElement, neighborhoodElement, addressElement, viewDetailsLinkElement
                            } = homePage.getElementsOfRestaurantArticle(article)

                            nameElement.should('have.length', 1)

                            nameElement.invoke('text').then((restaurantName: string) => {
                                const restaurant = restaurantsByName.get(restaurantName)

                                expect(restaurant).not.to.be.undefined
                                expect(restaurant).not.to.be.null

                                neighborhoodElement.should('have.length', 1)
                                    .and('have.text', restaurant.neighborhood)

                                addressElement.should('have.length', 1)
                                    .and('have.text', restaurant.address)

                                viewDetailsLinkElement.should('have.length', 1)
                                    .and('have.text', 'View Details')

                                imageElement.should('have.length', 1)
                                    .invoke('attr', 'data-alt')
                                    .should('equal', restaurant.alt)
                            }) 

                        }
                    )
                })
        })

        it('links to restaurant details page when view details link is clicked', () => {
            const detailsPage: DetailsPage = new DetailsPage()

            homePage.clickFirstViewDetailsLink()
                .then(({ restaurantName }) => {
                    cy.location('pathname')
                        .should('equal', detailsPage.getLocationPathname())

                    detailsPage.getRestaurantName()
                        .should('have.text', restaurantName)
                })
        })
    })

    describe('restaurant filters', () => {
        it.only('filters restaurant by neighborhood', () => {
            homePage.filterRestaurantsByNeighborhood(Neighborhoods.Brooklyn)
                .then(verifyFilteredRestaurants)
        })

        it('filters restaurant by cuisine', () => {
            homePage.filterRestaurantsByCuisine(Cuisines.Pizza)
                .then(verifyFilteredRestaurants)
        })

        it('filters restaurant by neighborhood and cuisine', () => {
            homePage.filterRestaurantsByNeighborhoodAndCuisine(Neighborhoods.Queens, Cuisines.Mexican)
                .then(verifyFilteredRestaurants)
        })

        it('shows complete list of restaurants when filters are reset', () => {
            homePage.filterRestaurantsByNeighborhoodAndCuisine(Neighborhoods.Manhattan, Cuisines.American)
                .then(() => {
                    homePage.resetFilters()

                    homePage.getRestaurantsFromAPICall()
                        .then((unfilteredRestaurants: Array<Restaurant>) => {

                            homePage.getRestaurantArticles()
                                .should('have.length', unfilteredRestaurants.length)

                        })
                    
                })
        })

        function verifyFilteredRestaurants(filteredRestaurants: Set<string>) {
            homePage.getRestaurantArticles()
                .should('have.length', filteredRestaurants.size)
                .each((restaurantArticle) => {
                    const restaurantName = homePage.getNameOfRestaurantArticle(restaurantArticle)
                    expect(filteredRestaurants).to.contain(restaurantName)
                })
        }
    })
})