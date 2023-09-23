describe('Home page', () => {

    beforeEach(() => {
        cy.visit('/')
    })

    describe('restaurants map', () => {

        beforeEach(() => {
           cy.getById('map').as('map')
        })

        it('renders a map', () => {
           
            cy.get('@map')
                .should('be.visible')
                .and('contain.text', 'Leaflet')
                .and('contain.text', 'Mapbox')
            
        })

        it('renders map location pins')

        it('links to restaurant details page when a pin is clicked')
    })
})