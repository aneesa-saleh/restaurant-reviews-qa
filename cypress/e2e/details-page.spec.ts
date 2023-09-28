import { Utils } from "../support/common/Utils"
import { DaysOfTheWeek } from "../support/common/constants"
import { Restaurant } from "../support/models/restaurant"
import { HomePage } from "../support/pages/HomePage"

describe('Details page', () => {

    let homePage: HomePage

    beforeEach(() => {
        homePage = new HomePage()
    })

    it('shows complete details of a restaurant', () => {
        homePage.clickViewDetailsLink(5).then(({ restaurantName: restaurantNameFromLink, detailsPage }) => {
            detailsPage.API.getRestaurantDetails().then((restaurant: Restaurant) => {
                    expect(restaurant).not.to.be.null
                    expect(restaurant.name).to.equal(restaurantNameFromLink)

                    detailsPage.getRestaurantName()
                        .should('be.visible')
                        .and('have.text', restaurant.name)

                    detailsPage.getRestaurantImage()
                        .should('be.visible')
                        .and('have.attr', 'alt', restaurant.alt)

                    detailsPage.getRestaurantCuisine()
                        .should('be.visible')
                        .and('contain.text', restaurant.cuisine_type)

                    detailsPage.getMap()
                        .should('be.visible')
                    
                    detailsPage.getMapPin()
                        .should('be.visible')
                        .and('have.attr', 'alt', restaurant.name)

                    detailsPage.getRestaurantAddress()
                        .should('be.visible')
                        .and('contain.text', restaurant.address)

                    detailsPage.getOpeningHours()
                        .then((openingHours) => {
                            expect(openingHours).to.be.visible
                            expect(
                                detailsPage.getOpeningHoursElements(openingHours)
                            ).to.have.length(7)

                            Utils.daysOfTheWeek().forEach((day) => {
                                expect(
                                    detailsPage.getOpeningHoursByDay(openingHours, day)
                                ).to.be.visible
                                expect(
                                    detailsPage.getOpeningHoursByDay(openingHours, day)
                                ).to.contain.text(restaurant.operating_hours[day])
                            })
                        })
                })
            })
    })
})