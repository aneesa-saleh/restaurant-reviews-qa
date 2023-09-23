import './commands'

beforeEach(() => {

    // prevent unexpected behaviour with service workers
    // see: https://github.com/cypress-io/cypress/issues/702
    cy.unregisterAllServiceWorkers()
    
})