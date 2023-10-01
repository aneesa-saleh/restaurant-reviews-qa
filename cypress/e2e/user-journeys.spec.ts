import { DetailsPage } from "../pages/DetailsPage"
import { HomePage } from "../pages/HomePage"
import { DetailsPageAPI } from "../pages/api/DetailsPageAPI"
import { HomePageAPI } from "../pages/api/HomePageAPI"
import { Restaurant } from "../pages/models/restaurant"
import { Cuisines, Neighborhoods } from "../support/common/constants"

describe('User journeys', () => {
    let homePage: HomePage
    let detailsPage: DetailsPage

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

    it('a user can navigate to a restaurant using its URL and leave a review for it', () => {
        /* Scenario: User goes to home page and clicks on a map pin to navigate to a restaurant near them */
        /* They have a meal there and decide to leave a review */
        /* They enter a name and rating but forgot to add a comment and try to submit */
        /* They see the validation error, and type in the comment */
        /* They submit and check that the review is in the list now */
    })
})