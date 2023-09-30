import './commands'

beforeEach(() => {
    // stub map tiles
    cy.intercept(/^https:\/\/api.tiles.mapbox.com/g, { fixture: 'images/70by70.png,null', statusCode: 200 })
})