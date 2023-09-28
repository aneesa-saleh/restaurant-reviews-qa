import { Restaurant } from "../../models/restaurant"

export class DetailsPageAPI {
    constructor() {
        this.interceptRestaurantDetails()
    }

    interceptRestaurantDetails() {
        cy.intercept('/restaurants/*').as('restaurantDetailsAPIRequest')
    }

    getRestaurantDetails(): Cypress.Chainable<Restaurant> {
        return cy.wait('@restaurantDetailsAPIRequest').then((interception) => {
            const restaurant: Restaurant = interception.response?.body
            return cy.wrap(restaurant)
        })
    }

    static generateAddReviewResponse(formData: AddReviewForm): AddReviewResponse {
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

export type AddReviewResponse = {
    restaurant_id: number;
    name: string;
    rating: number;
    comments: string;
    createdAt: string;
    updatedAt: string;
    id: number;
}