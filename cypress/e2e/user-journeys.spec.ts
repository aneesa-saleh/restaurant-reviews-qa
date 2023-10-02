import { HomePage } from "../pages/HomePage"
import { AddReviewFormData, DetailsPageAPI } from "../pages/api/DetailsPageAPI"
import { HomePageAPI } from "../pages/api/HomePageAPI"
import { Cuisines, Neighborhoods } from "../support/common/constants"

describe('User journeys', () => {
    let homePage: HomePage

    it('a user can search for and favourite a restaurant and review it', () => {

        /* First make sure the restaurant is unmarked as favourite */
        const homePageAPI: HomePageAPI = new HomePageAPI()
        const detailsPageAPI: DetailsPageAPI = new DetailsPageAPI({})

        homePageAPI.getRestaurantByNeighborhoodAndCuisine(Neighborhoods.Queens, Cuisines.Asian)
            .then(({ body: restaurants }) => {

                expect(restaurants).to.have.length.greaterThan(0)
                const restaurantId = restaurants[0].id
            
                detailsPageAPI.unmarkRestaurantAsFavouriteAPICall(restaurantId)

                return cy.wrap(restaurantId)

            }).then((restaurantId) => {

            /* Scenario: The user goes to the home page of Restaurant reviews */

            homePage = new HomePage()
            homePage.visit()

            // /* They search for and navigate to an Asian restaurant in their neighbourhood they went to recently */

            homePage.filterRestaurantsByNeighborhoodAndCuisine(Neighborhoods.Queens, Cuisines.Asian)
                .should('have.length.greaterThan', 0)
                .then((filteredRestaurants: Set<string>) => {
                    homePage.getRestaurants()
                        .should('have.length', filteredRestaurants.size)
                        .each((restaurantElement) => {
                            const restaurantName = homePage.getNameOfRestaurantFromElement(restaurantElement)
                            expect(filteredRestaurants).to.contain(restaurantName)
                        })
                })

            homePage.clickViewDetailsLink(0).then(({ detailsPage }) => {
                
                /* They mark the restaurant as one of their favourites */

                detailsPage.API.waitForRestaurantDetails()

                detailsPage.getFavouriteButton()
                    .should('contain.text', 'Mark restaurant as favourite')
                detailsPage.getFavouriteButtonIcon()
                    .should('have.class', 'unmarked')

                detailsPage.API.interceptMarkAsFavourite()

                detailsPage.clickFavouriteButton()
                    .should('be.disabled')
                    .and('contain.text', 'Unmark restaurant as favourite')
                detailsPage.getFavouriteButtonIcon()
                    .should('have.class', 'marked')

                cy.getById('favourite-spinner').should('be.visible')

                detailsPage.API.waitForMarkAsFavourite()
                    .should(({ response }) => {
                        expect(response.statusCode).to.equal(200)
                    })

                detailsPage.getSuccessToast()
                    .should('be.visible')
                    .and('contain.text', 'Restaurant has been marked as favourite')

                cy.getById('favourite-spinner').should('not.be.visible')

                detailsPage.getFavouriteButton()
                    .should('not.be.disabled')
                    .and('contain.text', 'Unmark restaurant as favourite')
                detailsPage.getFavouriteButtonIcon()
                    .should('have.class', 'marked')

                return cy.wrap(restaurantId)
            }).then((restaurantId: any) => {
                /* Cleanup */
                detailsPageAPI.unmarkRestaurantAsFavouriteAPICall(restaurantId)
            })
        })
    })

    it('a user can navigate to a restaurant from the map and leave a review for it', () => {
        const review: AddReviewFormData = {
            name: 'Amanda',
            rating: '4',
            comment: 'Best meal I\'ve ever tasted!'
        }

        /* Scenario: User goes to home page and clicks on a map pin to navigate to a restaurant near them */

        homePage = new HomePage()
        homePage.visit()

        homePage.clickMapPin(5)
            .then(({ detailsPage }) => {
                detailsPage.API.waitForRestaurantDetails()
                detailsPage.API.interceptAddReview()

                /* They have a meal there and decide to leave a review */
                /* They enter a name and rating but forgot to add a comment and try to submit */

                detailsPage.clickAddReviewButton()
                detailsPage.getModal()
                    .should('be.visible')
                detailsPage.typeName(review.name)
                detailsPage.chooseRating(review.rating)
                detailsPage.clickSubmitReviewButton()

                /* They see the validation error, and type in the comment */
                detailsPage.getModal().should('be.visible')

                detailsPage.getCommentsField().should('have.class', 'has-error')
                    .and('be.focused')
                detailsPage.getCommentsFieldError().should('be.visible')
                    .and('contain.text', 'This field is required')

                detailsPage.getFormErrorMessage().should('be.visible')
                    .and('contain.text', 'comments')
                    .and('not.contain.text', 'name')
                    .and('not.contain.text', 'rating')

                detailsPage.API.spyOnAddReview().should('not.have.been.called')

                detailsPage.typeComment(review.comment)
                    .should('not.have.class', 'has-error')
                detailsPage.getCommentsFieldError().should('not.be.visible')
                    
                /* They submit and check that the review is in the list now */

                detailsPage.clickSubmitReviewButton()
                
                detailsPage.getModal().should('not.be.visible')

                detailsPage.getSuccessToast()
                    .should('be.visible')

                detailsPage.getMostRecentReview().then((newReview) => {
                    const newReviewElements = detailsPage.getElementsOfReview(newReview)
                    expect(newReviewElements.reviewerName).to.contain.text(review.name)
                    expect(newReviewElements.rating).to.contain.text(`${review.rating}`)
                    expect(newReviewElements.comment).to.contain.text(review.comment)
                    expect(newReviewElements.date).not.to.be.empty
                })
            })
    })
})