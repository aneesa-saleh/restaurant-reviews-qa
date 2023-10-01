import { Utils } from "../support/common/Utils"
import { Restaurant } from "../pages/models/restaurant"
import { HomePage } from "../pages/HomePage"
import { AddReviewFormData } from "../pages/api/DetailsPageAPI"
import { DetailsPage } from "../pages/DetailsPage"

describe('Details page', () => {

    let homePage: HomePage

    it('shows complete details of a restaurant', () => {
        homePage = new HomePage()

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
        beforeEach(() => {
            homePage = new HomePage()
        })

        const sampleFormData: AddReviewFormData = {
            name: 'Aneesa',
            rating: '4',
            comment: 'Splendid'
        }

        describe('form validation', () => {
            let detailsPage: DetailsPage

            beforeEach(() => {
                homePage.clickViewDetailsLink(0).then(({ detailsPage: _detailsPage }) => {
                    detailsPage = _detailsPage
                    
                    detailsPage.API.interceptAndStubAddReview(sampleFormData)
    
                    detailsPage.clickAddReviewButton()
                    detailsPage.getModal().should('be.visible')
    
                    // form is blank

                    detailsPage.clickSubmitReviewButton()
                })
            })

            it('displays form errors and does not submit for invalid input', () => {
                detailsPage.getModal().should('be.visible')

                detailsPage.getNameField().should('have.class', 'has-error')
                detailsPage.getNameFieldError().should('be.visible')
                    .and('contain.text', 'This field is required')

                detailsPage.getRatingField().should('have.class', 'has-error')
                detailsPage.getRatingFieldError().should('be.visible')
                    .and('contain.text', 'This field is required')

                detailsPage.getCommentsField().should('have.class', 'has-error')
                detailsPage.getCommentsFieldError().should('be.visible')
                    .and('contain.text', 'This field is required')
                
                detailsPage.getFormErrorMessage().should('be.visible')
                    .and('contain.text', 'name')
                    .and('contain.text', 'rating')
                    .and('contain.text', 'comments')

                detailsPage.API.getAddReview().then((interceptedRequest) => {
                    expect(interceptedRequest).to.be.null
                })
            })

            it('clears form errors and submits a valid form after errors are resolved', () => {
                
                detailsPage.typeName(sampleFormData.name)
                    .should('not.have.class', 'has-error')
                detailsPage.getNameFieldError().should('not.be.visible')

                detailsPage.chooseRating(sampleFormData.rating)
                    .should('not.have.class', 'has-error')
                detailsPage.getRatingFieldError().should('not.be.visible')

                detailsPage.typeComment(sampleFormData.comment)
                    .should('not.have.class', 'has-error')
                detailsPage.getCommentsFieldError().should('not.be.visible')

                detailsPage.clickSubmitReviewButton()
                
                detailsPage.getModal().should('not.be.visible')
            })
        })

        it('saves a review successfully to API when user is online', () => {
            homePage.clickViewDetailsLink(0).then(({ detailsPage, restaurantName }) => {

                detailsPage.API.interceptAndStubAddReview(sampleFormData)

                detailsPage.clickAddReviewButton()
                detailsPage.getModal().should('be.visible')
                detailsPage.getModalTitle().should('contain.text', restaurantName)

                detailsPage.typeName(sampleFormData.name)
                detailsPage.chooseRating(sampleFormData.rating)
                detailsPage.typeComment(sampleFormData.comment)
 
                detailsPage.clickSubmitReviewButton()

                detailsPage.getModal().should('not.be.visible')

                detailsPage.getSuccessToast()
                    .should('be.visible')

                detailsPage.getMostRecentReview().then((newReview) => {
                    const newReviewElements = detailsPage.getElementsOfReview(newReview)
                    expect(newReviewElements.reviewerName).to.contain.text(sampleFormData.name)
                    expect(newReviewElements.rating).to.contain.text(`${sampleFormData.rating}`)
                    expect(newReviewElements.comment).to.contain.text(sampleFormData.comment)
                    expect(newReviewElements.date).not.to.be.empty
                })

                detailsPage.API.getAddReview().then((interceptedRequest) => {
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
                    // so offline capabilities like saving requests in idb won't work

                    // wait for reviews to load before going offline
                    detailsPage.API.spyOnReviews().should('have.been.called')
    
                    cy.goOffline().then(() => {
                        detailsPage.getErrorToast().should('be.visible')
                            .and('contain.text', 'You are offline')
                        detailsPage.closeToast()
        
                        detailsPage.API.interceptAndStubAddReview(sampleFormData)
        
                        detailsPage.clickAddReviewButton()
                        detailsPage.getModal().should('be.visible')
        
                        detailsPage.typeName(sampleFormData.name)
                        detailsPage.chooseRating(sampleFormData.rating)
                        detailsPage.typeComment(sampleFormData.comment)
         
                        detailsPage.clickSubmitReviewButton()
    
                        detailsPage.getErrorToast().should('be.visible')
                            .and('contain.text', 'An error occurred. Please try again')
                        detailsPage.getModal().should('be.visible')
        
                        detailsPage.API.getAddReview().then((interceptedRequest) => {
                            expect(interceptedRequest).to.be.null
                        })
                    })
                })
            })
        })
    })

    it.only('renders reviews list', () => {
        const detailsPage: DetailsPage = new DetailsPage({
            shouldStubReviews: true
        })

        detailsPage.visitRestaurant(1)
        detailsPage.API.waitForReviews().then((reviews) => {

            detailsPage.getReviewsList().should('be.visible')

            detailsPage.getReviews().should('have.length', reviews.length)
                .each((reviewElement, index) => {
                    const corresponsingReview = reviews[reviews.length - 1 -index] // go in reverse order
                    const { reviewerName, rating, comment } = detailsPage.getElementsOfReview(reviewElement)

                    expect(reviewerName).to.have.text(corresponsingReview.name)
                    expect(rating).to.contain.text(corresponsingReview.rating)
                    expect(comment).to.have.text(corresponsingReview.comments)
                })
        })
    })
})