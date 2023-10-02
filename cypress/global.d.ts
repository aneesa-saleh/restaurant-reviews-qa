declare namespace Cypress {
    interface Chainable {
        getById(id: string): Chainable<JQuery<HTMLElement>>
        getByClass(className: string): Chainable<JQuery<HTMLElement>>
        
        unregisterAllServiceWorkers(): void

        goOffline(): Bluebird.Promise<null>
        goOnline(): Bluebird.Promise<null>
    }
}