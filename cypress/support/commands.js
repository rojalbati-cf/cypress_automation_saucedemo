Cypress.Commands.add('login', (username, password) => {
    cy.session([username, password], () => {
        cy.visit('/')
        cy.get('#user-name').type(username)
        cy.get('#password').type(password)
        cy.get('.btn_action').click()
    })
})


Cypress.Commands.add('enterCheckoutInformation', (firstName, lastName, postalCode) => {
    cy.get('[data-test="firstName"]').type(firstName)
    cy.get('[data-test="lastName"]').type(lastName)
    cy.get('[data-test="postalCode"]').type(postalCode)
    cy.get('[data-test="continue"]').click()
})
