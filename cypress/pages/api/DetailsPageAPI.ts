import { Restaurant } from "../models/restaurant"
import { Review } from "../models/review"

export class DetailsPageAPI {
    constructor() {
        this.interceptRestaurantDetails()
    }

    interceptRestaurantDetails() {
        cy.intercept('/restaurants/*').as('restaurantDetails')
    }

    interceptAndStubAddReview(formData: AddReviewForm) {
        const addReviewResponse: Review = this.generateAddReviewResponse(formData)
        cy.intercept('POST', '/reviews', addReviewResponse)
                .as('addReview')
    }

    waitForAddRestaurantDetails() {
        cy.wait('@restaurantDetails')
    }

    waitForAddReview() {
        cy.wait('@addReview')
    }

    getRestaurantDetailsRequest() {
        return cy.get('@restaurantDetails')
    }

    getAddReviewRequest() {
        return cy.get('@addReview')
    }

    getRestaurantDetails(): Cypress.Chainable<Restaurant> {
        return cy.wait('@restaurantDetails').then((interception) => {
            const restaurant: Restaurant = interception.response?.body
            return cy.wrap(restaurant)
        })
    }

    generateAddReviewResponse(formData: AddReviewForm): Review {
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

export type AddReviewForm = {
    name: string;
    rating: number;
    comment: string;
}