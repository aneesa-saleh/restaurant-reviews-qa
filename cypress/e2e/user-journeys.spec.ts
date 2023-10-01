import { DetailsPage } from "../pages/DetailsPage"
import { HomePage } from "../pages/HomePage"
import { Cuisines, Neighborhoods } from "../support/common/constants"
import { verifyFilteredRestaurants } from "./home-page.spec"

describe('User journeys', () => {
    let homePage: HomePage
    let detailsPage: DetailsPage

    it('a user can search for and favourite a restaurant and review it', () => {
        /* First make sure the restaurant is unmarked as favourite */

        cy.request(
            `${Cypress.env('apiUrl')}restaurants?neighborhood=${Neighborhoods.Queens}&cuisine_type=${Cuisines.Asian}`
        ).then(({ body }) => {
            expect(body).to.have.length.greaterThan(0)
            const restaurantId = body[0].id
            cy.request(
                `${Cypress.env('apiUrl')}restaurants/${restaurantId}/?is_favorite=false`
            )
        }).then(() => {
            /* Scenario: The user goes to the home page of Restaurant reviews */

            homePage = new HomePage()
            homePage.visit()

            /* They search for and navigate to an Asian restaurant in their neighbourhood they went to recently */

            homePage.filterRestaurantsByNeighborhoodAndCuisine(Neighborhoods.Queens, Cuisines.Asian)
                .should('have.length.greaterThan', 0)
                .then((filteredRestaurants) => verifyFilteredRestaurants(homePage, filteredRestaurants))

            homePage.clickViewDetailsLink(0).then(({ detailsPage }) => {
                
                /* They mark the restaurant as favourite so they can easily find it later */

                detailsPage.API.waitForRestaurantDetails()

                detailsPage.getFavouriteButton()
                    .should('contain.text', 'Mark restaurant as favourite')
                detailsPage.getFavouriteButtonIcon()
                    .should('have.class', 'unmarked')

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
            })
        })
    })

    it('a user can navigate to a restaurant using its URL and leave a review for it', () => {
        /* Scenario: User clicks on a map pin to navigate to a restaurant near them */
        /* They have a meal there and decide to leave a review */
        /* They enter a name and rating but forgot to add a comment and try to submit */
        /* They see the validation error, and type in the comment */
        /* They submit and check that the review is in the list now */
    })
})