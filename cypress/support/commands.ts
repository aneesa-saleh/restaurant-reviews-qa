
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
                    displayName: 'Service Worker',
                    message: `Unregistering: ${registration?.active?.scriptURL}`
                })
            
                registration.unregister()
            })
        })
    }
})

Cypress.Commands.add('goOffline', () => {
    Cypress.log({
        name: 'goOffline',
        displayName: 'Network',
        message: 'Going offline'
    })

    // https://chromedevtools.github.io/devtools-protocol/1-3/Network/#method-emulateNetworkConditions
    return Cypress.automation('remote:debugger:protocol', { command: 'Network.enable' })
        .then(() => {
            return Cypress.automation('remote:debugger:protocol',
            {
                command: 'Network.emulateNetworkConditions',
                params: {
                offline: true,
                latency: -1,
                downloadThroughput: -1,
                uploadThroughput: -1,
                },
            })
        })
})

Cypress.Commands.add('goOnline', () => {
    Cypress.log({
        name: 'goOnline',
        displayName: 'Network',
        message: 'Going back online'
    })

    // https://chromedevtools.github.io/devtools-protocol/1-3/Network/#method-emulateNetworkConditions
    return Cypress.automation('remote:debugger:protocol',
    {
      command: 'Network.emulateNetworkConditions',
      params: {
        offline: false,
        latency: -1,
        downloadThroughput: -1,
        uploadThroughput: -1,
      },
    })
    .then(() => {
        return Cypress.automation('remote:debugger:protocol',
            {
            command: 'Network.disable',
            })
    })
})