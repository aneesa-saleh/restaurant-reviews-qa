declare namespace Cypress {
    interface Chainable {
        getById(id: string): Chainable<JQuery<HTMLElement>>
        getByClass(className: string): Chainable<JQuery<HTMLElement>>
        
        unregisterAllServiceWorkers(): void
    }
}

Cypress.Commands.add('getById', (id: string) => {
    return cy.get(`#${id}`)
})

Cypress.Commands.add('getByClass', (className: string) => {
    return cy.get(`.${className}`)
})

Cypress.Commands.add('unregisterAllServiceWorkers', () => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
            registrations.forEach((registration) => {
                
                Cypress.log({
                    name: 'unregisterAllServiceWorkers',
                    // shorter name for the Command Log
                    displayName: 'Service Worker',
                    message: `Unregistering: ${registration?.active?.scriptURL}`
                })
            
                registration.unregister()
            })
        })
    }
})