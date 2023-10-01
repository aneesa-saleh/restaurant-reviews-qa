import { Restaurant } from "../pages/models/restaurant"
import { HomePage } from "../pages/HomePage"
import { Cuisines, Neighborhoods } from "../support/common/constants"
import { RestaurantNamesAndCount } from "../pages/api/HomePageAPI"

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

            homePage.clickMapPin(0)
                .then(({ title, detailsPage }) => {
                    cy.location('pathname')
                        .should('equal', detailsPage.getLocationPathname())

                    detailsPage.getRestaurantName()
                        .should('have.text', title)
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
            homePage.API.getRestaurantsMappedByName().then((restaurantsByName) => {
                    homePage.getRestaurants().each((restaurantElement) => {
                        const {
                            nameElement, imageElement, neighborhoodElement, addressElement, viewDetailsLinkElement
                        } = homePage.getElementsOfRestaurant(restaurantElement)

                        expect(nameElement).to.be.visible

                        const restaurantName = nameElement.text()
                        const restaurant = restaurantsByName.get(restaurantName)

                        expect(restaurant).not.to.be.undefined
                            .and.not.to.be.null

                        expect(neighborhoodElement).to.be.visible
                        expect(neighborhoodElement).to.have.text(restaurant.neighborhood)

                        expect(addressElement).to.be.visible
                        expect(addressElement).to.have.text(restaurant.address)

                        expect(viewDetailsLinkElement).to.be.visible
                        expect(viewDetailsLinkElement).to.have.text('View Details')

                        expect(imageElement).to.be.visible
                        expect(imageElement).attr('data-alt')
                            .to.equal(restaurant.alt)

                    })
            })
        })

        it('links to restaurant details page when view details link is clicked', () => {
            homePage.clickViewDetailsLink(0)
                .then(({ restaurantName, detailsPage }) => {
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