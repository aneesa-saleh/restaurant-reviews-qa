import { Restaurant } from "../models/restaurant"
import { Review } from "../models/review"

export class DetailsPageAPI {
    constructor() {
        this.interceptRestaurantDetails()
        this.interceptReviews()
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

    waitForAddReview() {
        cy.wait('@addReview')
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