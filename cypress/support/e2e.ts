import './commands'

beforeEach(() => {
    // prevent unexpected behaviour with service workers
    // see: https://github.com/cypress-io/cypress/issues/702
    cy.unregisterAllServiceWorkers()

    // stub map tiles
    cy.intercept(/^https:\/\/api.tiles.mapbox.com/g, { fixture: 'images/70by70.png,null', statusCode: 200 })
})