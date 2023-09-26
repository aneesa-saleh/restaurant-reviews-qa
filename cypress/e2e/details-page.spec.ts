import { DaysOfTheWeek } from "../support/common/constants"
import { Restaurant } from "../support/models/restaurant"
import { HomePage } from "../support/pages/HomePage"

describe('Details page', () => {

    let homePage: HomePage

    beforeEach(() => {
        homePage = new HomePage()
    })

    describe('details of a restaurant', () => {
        it('shows complete details', () => {
            homePage.clickViewDetailsLink(5).then(({ restaurantName: restaurantNameFromLink, detailsPage }) => {
                detailsPage.API.getRestaurantDetails().then((restaurant: Restaurant) => {
                        expect(restaurant).not.to.be.null
                        expect(restaurant.name).to.equal(restaurantNameFromLink)

                        cy.getById('restaurant-name')
                            .should('have.length', 1)
                            .and('have.text', restaurant.name)

                        cy.getByClass('restaurant-img')
                            .should('have.length', 1)
                            .then((img) => {
                                expect(img).to.have.attr('alt')
                                expect(img.attr('alt')).to.equal(restaurant.alt)
                            })

                        cy.getById('restaurant-cuisine')
                            .should('have.length', 1)
                            .and('contain.text', restaurant.cuisine_type)

                        cy.getById('map')
                            .should('be.visible')
                        
                        cy.get('img.leaflet-marker-icon')
                            .should('have.length', 1)
                            .then((img) => {
                                expect(img).to.have.attr('alt')
                                expect(img.attr('alt')).to.equal(restaurant.name)
                            })

                        cy.getById('restaurant-address')
                            .should('have.length', 1)
                            .and('contain.text', restaurant.address)

                        cy.getById('restaurant-hours')
                            .should('be.visible')
                            .then((openingHoursTable) => {
                                expect(openingHoursTable.find('tr')).to.have.length(7)

                                const daysOfTheWeek = Object.values(DaysOfTheWeek)

                                daysOfTheWeek.forEach((day) => {
                                    expect(openingHoursTable.find(`tr:contains("${day}")`)).to.have.length(1)
                                })
                            })
                    })
                })
                
        })
    })
})