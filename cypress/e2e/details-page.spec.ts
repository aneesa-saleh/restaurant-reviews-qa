import { Utils } from "../support/common/Utils"
import { Restaurant } from "../pages/models/restaurant"
import { HomePage } from "../pages/HomePage"
import { AddReviewForm } from "../pages/api/DetailsPageAPI"
import { DetailsPage } from "../pages/DetailsPage"

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

    describe('adding a review', () => {
        const formData: AddReviewForm = {
            name: 'Aneesa',
            rating: 4,
            comment: 'Splendid'
        }

        it('saves a review successfully to API when user is online', () => {
            homePage.clickViewDetailsLink(0).then(({ detailsPage, restaurantName }) => {
                

                detailsPage.API.interceptAndStubAddReview(formData)

                detailsPage.clickAddReviewButton()
                detailsPage.getModal().should('be.visible')
                detailsPage.getModalTitle().should('contain.text', restaurantName)

                detailsPage.typeName(formData.name)
                detailsPage.chooseRating(formData.rating)
                detailsPage.typeComment(formData.comment)
 
                detailsPage.clickSubmitReviewButton()

                detailsPage.API.waitForAddReview()

                detailsPage.getModal().should('not.be.visible')

                detailsPage.getSuccessToast()
                    .should('be.visible')

                detailsPage.getMostRecentReview().then((newReview) => {
                    const newReviewElements = detailsPage.getReviewElements(newReview)
                    expect(newReviewElements.reviewerName).to.contain.text(formData.name)
                    expect(newReviewElements.rating).to.contain.text(`${formData.rating}`)
                    expect(newReviewElements.comment).to.contain.text(formData.comment)
                    expect(newReviewElements.date).not.to.be.empty
                })

                detailsPage.API.getAddReviewRequest().then((interceptedRequest) => {
                    expect(interceptedRequest).not.to.be.null
                })
            })
        })

        describe('when user is offline (no service worker controlling the page)', () => {
            // this test needs a separate describe block because of the cleanup
            // required (going back online), which won't happen if the test fails
            // for any reason, causing all subsequents test to fail since it can't
            // connect to cypress

            after(() => {
                cy.goOnline()
            })

            it('does not submit review', () => {
                homePage.clickViewDetailsLink(0).then(({ detailsPage }) => {
                    // service workers are disabled during [automated] test mode
    
                    cy.goOffline().then(() => {
                        detailsPage.getErrorToast().should('be.visible')
                            .and('contain.text', 'You are offline')
                        detailsPage.closeToast()
        
                        detailsPage.API.interceptAndStubAddReview(formData)
        
                        detailsPage.clickAddReviewButton()
                        detailsPage.getModal().should('be.visible')
        
                        detailsPage.typeName(formData.name)
                        detailsPage.chooseRating(formData.rating)
                        detailsPage.typeComment(formData.comment)
         
                        detailsPage.clickSubmitReviewButton()
    
                        detailsPage.getErrorToast().should('be.visible')
                            .and('contain.text', 'An error occurred. Please try again')
                        detailsPage.getModal().should('be.visible')
        
                        detailsPage.API.getAddReviewRequest().then((interceptedRequest) => {
                            expect(interceptedRequest).to.be.null
                        })
                    })
                })
            })
        })

    })
})