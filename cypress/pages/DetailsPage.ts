import { DaysOfTheWeek } from "../support/common/constants";
import { DetailsPageAPI } from "./api/DetailsPageAPI";

export class DetailsPage {

    API: DetailsPageAPI

    private defaultOptions = {
        shouldStubReviews: false,
        shouldWaitForReviews: false,
    }

    constructor(_options? : DetailsPageOptions) {
        const options  = _options || this.defaultOptions
        this.API = new DetailsPageAPI(options)
    }

    visitRestaurant(restaurantId: number) {
        if (restaurantId < 1 || restaurantId > 10)
            throw new RangeError('Restaurant ID should be from 1 to 10 (inclusive)')

        cy.visit(`/restaurant.html?id=${restaurantId}`)
    }

    /* Locators */

    getLocationPathname(): string {
        return '/restaurant.html'
    }

    getRestaurantName(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-name')
    }

    getRestaurantImage(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getByClass('restaurant-img')
    }

    getRestaurantCuisine(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-cuisine')
    }

    getMap(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('map')
    }

    getMapPin(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('img.leaflet-marker-icon')
    }

    getRestaurantAddress(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-address')
    }

    getOpeningHours(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('restaurant-hours')
    }

    getOpeningHoursElements(openingHours: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return openingHours.find('tr')
    }

    getOpeningHoursByDay(openingHours: JQuery<HTMLElement>, day: DaysOfTheWeek): JQuery<HTMLElement> {
        return openingHours.find(`tr:contains("${day}")`)
    }

    getAddReviewButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('add-review-button')
    }

    getModal(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getByClass('overlay')
    }

    getModalTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('add-review-overlay-heading')
    }

    getNameField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('name')
    }

    getNameFieldError(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('name-error')
    }

    getRatingField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('rating')
    }

    getRatingValue(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getByClass('rating-value')
    }

    getRatingFieldError(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('rating-error')
    }

    getCommentsField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('comments')
    }

    getCommentsFieldError(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('comments-error')
    }

    getFormErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('add-review-form-error')
    }

    getSubmitReviewButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('add-review-submit')
    }

    getCancelButton(): Cypress.Chainable<JQuery<HTMLButtonElement>> {
        return cy.getByClass('overlay-content').contains('button', 'Cancel')
    }

    getReviewsList(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('reviews-list')
    }

    getReviews(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('article.review')
    }

    getReview(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('article.review')
            .should('have.length.greaterThan', index)
            .eq(index)
    }

    getMostRecentReview(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getReview(0)
    }

    getPendingReviews() {
        return cy.get('article.review.sending')
    }

    getElementsOfReview(review: JQuery<HTMLElement>): ReviewElements {
        return {
            reviewerName: review.find('p.review-name'),
            date: review.find('p.review-date'),
            rating: review.find('p.review-rating'),
            comment: review.find('.review-content p').last()

        }
    }

    getSuccessToast(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.toast.success.show')
    }

    getInfoToast(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.toast.show')
    }

    getErrorToast(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.toast.error.show')
    }

    getCloseToastButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.close-toast')
    }

    getFavouriteButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('mark-as-favourite')
    }

    getFavouriteButtonIcon(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getFavouriteButton().find('i.fa-star')
    }

    /* UI actions */

    clickAddReviewButton() {
        return this.getAddReviewButton().click()
    }

    typeName(name: string) {
        return this.getNameField().type(name)
    }

    chooseRating(rating: string) {
        return this.getRatingField()
            .invoke('val', rating)
            .trigger('change')
    }

    typeComment(comment: string) {
        return this.getCommentsField().type(comment)
    }

    clickSubmitReviewButton() {
        return this.getSubmitReviewButton().click()
    }

    clickCancelButton() {
        return this.getCancelButton().click()
    }

    closeToast() {
        return this.getCloseToastButton().click()
    }

    clickFavouriteButton() {
        return this.getFavouriteButton().click()
    }

}

export type DetailsPageOptions = {
    shouldStubReviews?: boolean;
}

type ReviewElements = {
    reviewerName: JQuery<HTMLElement>;
    date: JQuery<HTMLElement>;
    rating: JQuery<HTMLElement>;
    comment: JQuery<HTMLElement>;
}