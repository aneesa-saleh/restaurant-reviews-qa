import { Restaurant } from "../support/models/restaurant"
import { DetailsPage } from "../support/pages/DetailsPage"
import { HomePage, MapPin } from "../support/pages/HomePage"
import { Cuisines, Neighborhoods } from "../support/common/constants"
import { RestaurantNamesAndCount } from "../support/api/HomePageAPI"

describe('Home page', () => {

    let homePage: HomePage

    beforeEach(() => {
        homePage = new HomePage()
    })

    describe('restaurants map', () => {
        it('renders a map', () => {
                homePage.getMap()
                    .should('be.visible')
        })

        it('renders map location pins correctly', () => {
            homePage.API.getRestaurantNamesAndCount()
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

            homePage.clickMapPin(0)
                .then((mapPin: MapPin) => {
                    cy.location('pathname')
                        .should('equal', detailsPage.getLocationPathname())

                    detailsPage.getRestaurantName()
                        .should('have.text', mapPin.title)
                })
        })
    })

    describe('list of restaurants', () => {
        it('shows the correct number of restaurants', () => {
            homePage.API.getRestaurantsCount()
                .then(({ restaurantsCountFromAPI }) => {
                    homePage.getRestaurants()
                        .should('have.length', restaurantsCountFromAPI)
                })
        })

        it('shows a complete summary of each restaurant', () => {
            homePage.API.getRestaurantsMappedByName()
                .then((restaurantsByName) => {
                    homePage.getRestaurants().each(
                        (restaurantElement) => {
                            const {
                                nameElement, imageElement, neighborhoodElement, addressElement, viewDetailsLinkElement
                            } = homePage.getElementsOfRestaurant(restaurantElement)

                            expect(nameElement).to.have.lengthOf(1)

                            const restaurantName = nameElement.text()
                            const restaurant = restaurantsByName.get(restaurantName)

                            expect(restaurant).not.to.be.undefined
                            expect(restaurant).not.to.be.null

                            expect(neighborhoodElement).to.have.lengthOf(1)
                                .and.to.have.text(restaurant.neighborhood)

                            expect(addressElement).to.have.lengthOf(1)
                                .and.to.have.text(restaurant.address)

                            expect(viewDetailsLinkElement).to.have.lengthOf(1)
                                .and.to.have.text('View Details')

                            expect(imageElement).to.have.lengthOf(1)
                            expect(imageElement.attr('data-alt'))
                                .to.have.equal(restaurant.alt)

                        }
                    )
                })
        })

        it('links to restaurant details page when view details link is clicked', () => {
            const detailsPage: DetailsPage = new DetailsPage()

            homePage.clickViewDetailsLink(0)
                .then(({ restaurantName }) => {
                    cy.location('pathname')
                        .should('equal', detailsPage.getLocationPathname())

                    detailsPage.getRestaurantName()
                        .should('have.text', restaurantName)
                })
        })
    })

    describe('restaurant filters', () => {
        it('filters restaurant by neighborhood', () => {
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

                    homePage.API.getRestaurants()
                        .then((unfilteredRestaurants: Array<Restaurant>) => {

                            homePage.getRestaurants()
                                .should('have.length', unfilteredRestaurants.length)

                        })
                    
                })
        })

        function verifyFilteredRestaurants(filteredRestaurants: Set<string>) {
            homePage.getRestaurants()
                .should('have.length', filteredRestaurants.size)
                .each((restaurantElement) => {
                    const restaurantName = homePage.getNameOfRestaurantFromElement(restaurantElement)
                    expect(filteredRestaurants).to.contain(restaurantName)
                })
        }
    })
})