import { DetailsPageOptions } from "../DetailsPage"
import { Restaurant } from "../models/restaurant"
import { Review } from "../models/review"

export class DetailsPageAPI {
    constructor({ shouldStubReviews = false, shouldWaitForReviews = false } : DetailsPageOptions) {
        this.interceptRestaurantDetails()

        shouldStubReviews ? this.interceptAndStubReviews() : this.interceptReviews()
        
        if (shouldWaitForReviews) this.waitForReviews()

    }

    interceptRestaurantDetails() {
        cy.intercept('/restaurants/*').as('restaurantDetails')
    }

    interceptReviews() {
        cy.intercept('/reviews/?restaurant_id=*', cy.spy().as('reviews'))
    }

    interceptAndStubAddReview(formData: AddReviewFormData) {
        const addReviewResponse: Review = this.generateAddReviewResponse(formData)
        cy.intercept('POST', '/reviews', addReviewResponse)
                .as('addReview')
    }

    interceptAndStubReviews() {
        cy.intercept('POST', '/reviews', { fixture: 'api/reviews.json'}).as('addReview')
    }

    waitForAddReview() {
        return cy.wait('@addReview')
    }

    waitForReviews() {
        return cy.wait('@reviews', { timeout: 5000 })
    }

    getRestaurantDetailsRequest() {
        return cy.get('@restaurantDetails')
    }

    getReviewsRequest() {
        return cy.get('@reviews')
    }

    getAddReviewRequest() {
        return cy.get('@addReview')
    }

    getRestaurantDetails(): Cypress.Chainable<Restaurant> {
        return cy.wait('@restaurantDetails').then((interception: any) => {
            const restaurant: Restaurant = interception.response?.body
            return cy.wrap(restaurant)
        })
    }

    generateAddReviewResponse(formData: AddReviewFormData): Review {
        const currentDate = (new Date()).toISOString()

        return {
            restaurant_id: 500,
            name: formData.name,
            rating: formData.rating,
            comments: formData.comment,
            createdAt: currentDate,
            updatedAt: currentDate,
            id: 500
        }
    }
}

export type AddReviewFormData = {
    name: string;
    rating: string;
    comment: string;
}