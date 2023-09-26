import { DaysOfTheWeek } from "../common/constants";
import { DetailsPageAPI } from "./api/DetailsPageAPI";

export class DetailsPage {

    API: DetailsPageAPI

    constructor() {
        this.API = new DetailsPageAPI()
    }

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
}