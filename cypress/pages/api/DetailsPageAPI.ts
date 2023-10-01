import { DetailsPageOptions } from "../DetailsPage"
import { Restaurant } from "../models/restaurant"
import { Review } from "../models/review"

export class DetailsPageAPI {
    constructor({ shouldStubReviews = false  } : DetailsPageOptions) {
        this.interceptRestaurantDetails()

        shouldStubReviews ? this.interceptAndStubReviews() : this.interceptReviews()

    }

    unmarkRestaurantAsFavouriteAPICall(restaurantId: number) {
        if (restaurantId < 1 || restaurantId > 10)
            throw new RangeError('Restaurant ID should be from 1 to 10 (inclusive)')

        const url = `${Cypress.env('apiUrl')}restaurants/${restaurantId}/?is_favorite=false`

        return cy.request('PUT', url).as('unmarkAsFavouriteAPICall')
    }

    markRestaurantAsFavouriteAPICall(restaurantId: number) {
        if (restaurantId < 1 || restaurantId > 10)
            throw new RangeError('Restaurant ID should be from 1 to 10 (inclusive)')

        const url = `${Cypress.env('apiUrl')}restaurants/${restaurantId}/?is_favorite=true`

        return cy.request('PUT', url).as('markAsFavouriteAPICall')
    }

    interceptMarkAsFavourite() {
        return cy.intercept('/restaurants/*/?is_favorite=true').as('markAsFavourite')
    }

    interceptRestaurantDetails() {
        cy.intercept('/restaurants/*').as('restaurantDetails')
    }

    interceptAndStubAddReview(formData: AddReviewFormData) {
        const addReviewResponse: Review = this.generateAddReviewResponse(formData)
        cy.intercept('POST', '/reviews', addReviewResponse)
                .as('addReview')
    }

    interceptReviews() {
        cy.intercept('/reviews/?restaurant_id=*', cy.spy().as('reviewsSpy')).as('reviews')
    }

    interceptAndStubReviews() {
        cy.intercept('/reviews/?restaurant_id=*', { fixture: 'api/reviews.json'}).as('reviews')
    }

    waitForAddReview() {
        return cy.wait('@addReview')
    }

    waitForReviews() {
        return cy.wait('@reviews').then((interception) => {
            const reviews: Array<Review> = Array.from(interception.response?.body)
            return cy.wrap(reviews)
        })
    }

    waitForRestaurantDetails() {
        return cy.wait('@restaurantDetails')
    }

    waitForMarkAsFavourite() {
        return cy.wait('@markAsFavourite')
    }

    getRestaurantDetails(): Cypress.Chainable<Restaurant> {
        return this.waitForRestaurantDetails().then((interception: any) => {
            const restaurant: Restaurant = interception.response?.body
            return cy.wrap(restaurant)
        })
    }

    getReviews() {
        return cy.get('@reviews')
    }

    spyOnReviews() {
        return cy.get('@reviewsSpy')
    }
    

    getAddReview() {
        return cy.get('@addReview')
    }

    getUnmarkAsFavouriteAPICall() {
        return cy.get('@unmarkAsFavouriteAPICall')
    }

    getMarkAsFavouriteAPICall() {
        return cy.get('@markAsFavouriteAPICall')
    }

    generateAddReviewResponse(formData: AddReviewFormData): Review {
        const currentDate = (new Date()).toISOString()

        return {
            restaurant_id: 1,
            name: formData.name,
            rating: formData.rating,
            comments: formData.comment,
            createdAt: currentDate,
            updatedAt: currentDate,
            id: 1
        }
    }
}

export type AddReviewFormData = {
    name: string;
    rating: string;
    comment: string;
}