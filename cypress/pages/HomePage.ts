import { HomePageAPI } from "./api/HomePageAPI";
import { Restaurant } from "../support/models/restaurant";
import { Cuisines, Neighborhoods } from "../support/common/constants";
import { DetailsPage } from "./DetailsPage";


export class HomePage {

    API: HomePageAPI

    constructor() {
        this.API = new HomePageAPI()
        this.visit()
    }

    private visit() {
        cy.visit('/');
    }

    /* locators */
    getMap(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('map');
    }

    getMapPins(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('img.leaflet-marker-icon');
    }

    getRestaurants(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#restaurants-list article');
    }

    getNameOfRestaurantFromElement(restaurantElement: JQuery<HTMLElement>): string {
        return restaurantElement.find('h2').text();
    }

    getNameElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('h2');
    }

    getImageElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('img');
    }

    getNaighborhoodElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement
            .find('p')
            .first();
    }

    getAddressElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement
            .find('p')
            .eq(1);
    }

    getViewDetailsElementOfRestaurant(restaurantElement: JQuery<HTMLElement>): JQuery<HTMLElement> {
        return restaurantElement.find('a');
    }

    getElementsOfRestaurant(restaurantElement: JQuery<HTMLElement>): RestaurantElements {

        const nameElement = this.getNameElementOfRestaurant(restaurantElement);
        const imageElement = this.getImageElementOfRestaurant(restaurantElement);
        const neighborhoodElement = this.getNaighborhoodElementOfRestaurant(restaurantElement);
        const addressElement = this.getAddressElementOfRestaurant(restaurantElement);
        const viewDetailsLinkElement = this.getViewDetailsElementOfRestaurant(restaurantElement);

        return {
            nameElement,
            imageElement,
            neighborhoodElement,
            addressElement,
            viewDetailsLinkElement
        };
    }

    getNeighborhoodSelect(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('neighborhoods-select');
    }

    getCuisineSelect(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.getById('cuisines-select');
    }

    /* UI actions */
    clickMapPin(index: number): Cypress.Chainable<MapPin> {
        // need this since we plan on going to a new page
        // when we click the map pin
        cy.unregisterAllServiceWorkers();

        return this.getMapPins()
            // first make sure a map pin exists at that index, otherwise fail the test
            .should('have.length.greaterThan', index)
            .eq(index)
            .then((mapPin) => {
                const title = mapPin.attr('title')
                // instantiate details page before clicking to set up intercepts
                const detailsPage = new DetailsPage()

                cy.wrap(mapPin).click();

                return cy.wrap({ title, detailsPage })
            });
    }

    clickViewDetailsLink(index: number): Cypress.Chainable<ViewDetailsLink> {
        // need this since we plan on going to a new page
        // when we click the link
        cy.unregisterAllServiceWorkers();

        return this.getRestaurants()
            .should('have.length.greaterThan', index)
            .eq(index)
            .then((restaurantElement) => {
                const restaurantName = this.getNameOfRestaurantFromElement(restaurantElement)
                // instantiate details page before clicking to set up intercepts
                const detailsPage = new DetailsPage()

                cy.wrap(this.getViewDetailsElementOfRestaurant(restaurantElement))
                    .click();

                return cy.wrap({ restaurantName, detailsPage });
            });
    }

    selectNeighborhood(neighborhood: Neighborhoods) {
        this.getNeighborhoodSelect()
            .select(neighborhood);
    }

    selectCuisine(cuisine: Cuisines) {
        this.getCuisineSelect()
            .select(cuisine);
    }

    resetFilters() {
        this.selectNeighborhood(Neighborhoods.AllNeighborhoods);
        this.selectCuisine(Cuisines.AllCuisines);
    }

    filterRestaurantsByNeighborhood(neighborhood: Neighborhoods): Cypress.Chainable<Set<string>> {
        this.selectNeighborhood(neighborhood);

        return this.API.getRestaurants().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>;
            restaurants.filter(restaurant => restaurant.neighborhood === neighborhood)
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name);
                });

            return cy.wrap(filteredRestaurants);
        });
    }

    filterRestaurantsByCuisine(cuisine: Cuisines): Cypress.Chainable<Set<string>> {
        this.selectCuisine(cuisine);

        return this.API.getRestaurants().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>;
            restaurants.filter(restaurant => restaurant.cuisine_type === cuisine)
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name);
                });

            return cy.wrap(filteredRestaurants);
        });
    }

    filterRestaurantsByNeighborhoodAndCuisine(neighborhood: Neighborhoods, cuisine: Cuisines): Cypress.Chainable<Set<string>> {
        this.selectNeighborhood(neighborhood);
        this.selectCuisine(cuisine);

        return this.API.getRestaurants().then((restaurants: Array<Restaurant>) => {
            const filteredRestaurants = new Set<string>;
            restaurants.filter(
                restaurant => restaurant.cuisine_type === cuisine && restaurant.neighborhood === neighborhood
            )
                .forEach((restaurant: Restaurant) => {
                    filteredRestaurants.add(restaurant.name);
                });

            return cy.wrap(filteredRestaurants);
        });
    }
}

export type MapPin = {
    title: string;
    detailsPage: DetailsPage;
};

export type ViewDetailsLink = {
    restaurantName: string;
    detailsPage: DetailsPage;
};

export type RestaurantElements = {
    nameElement: JQuery<HTMLElement>;
    imageElement: JQuery<HTMLElement>;
    neighborhoodElement: JQuery<HTMLElement>;
    addressElement: JQuery<HTMLElement>;
    viewDetailsLinkElement: JQuery<HTMLElement>;
};

