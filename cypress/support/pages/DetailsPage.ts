import { DaysOfTheWeek } from "../common/constants";
import { DetailsPageAPI } from "./api/DetailsPageAPI";

export class DetailsPage {

    API: DetailsPageAPI

    constructor() {
        this.API = new DetailsPageAPI()
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

    getReviewElements(review: JQuery<HTMLElement>): ReviewElements {
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

    /* UI actions */

    clickAddReviewButton() {
        this.getAddReviewButton().click()
    }

    typeName(name: string) {
        this.getNameField().type(name)
    }

    chooseRating(rating: number) {
        this.getRatingField()
            .invoke('val', rating)
            .trigger('change')
    }

    typeComment(comment: string) {
        this.getCommentsField().type(comment)
    }

    clickSubmitReviewButton() {
        this.getSubmitReviewButton().click()
    }

    clickCancelButton() {
        this.getCancelButton().click()
    }

}

type ReviewElements = {
    reviewerName: JQuery<HTMLElement>;
    date: JQuery<HTMLElement>;
    rating: JQuery<HTMLElement>;
    comment: JQuery<HTMLElement>;
}