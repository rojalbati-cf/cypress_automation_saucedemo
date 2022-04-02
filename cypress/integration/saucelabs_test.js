/// <reference types="cypress" />

describe('Sauce Labs Test: Login', function () {

    beforeEach(() => {
        // Load the fixture file fixtures/user.json before each test
        cy.fixture('user').then(function (data) {
            this.user = data;
        })
    })

    it('Verify locked_out_user cannot login', function () {
        cy.login(this.user.invalidusername, this.user.password)
        cy.get('[data-test="error"]').should('have.text', this.user.errorText)
    })

    it('Verify you can log in with user: Standard_user', function () {
        cy.login(this.user.username, this.user.password)
        cy.url().should('include', '/inventory.html')
        // Save the cokie "session-username" to a variable so we can reuse it in other tests
        cy.getCookie('session-username').then(function (response) {
            Cypress.env('dev_token', response.value)
        })
    })

})

describe('Sauce Labs Test: Add to Cart, Filter, Checkout', function () {

    beforeEach(function () {
        // Load the fixture file fixtures/user.json before each test
        cy.fixture('user').then(function (data) {
            this.user = data;
        })
        // Set the cokie "session-username" before each test
        cy.setCookie('session-username', Cypress.env('dev_token'))
    })

    it('Verify the Standard_user can add items to the card', function () {
        cy.visit('/inventory.html', { failOnStatusCode: false })
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('.inventory_item_name').should('have.text', 'Sauce Labs Backpack')
    })

    it('Verify the Standard_user user can filter the products', function () {
        cy.visit('/inventory.html', { failOnStatusCode: false })
        cy.get('.product_sort_container').select('Price (low to high)');
        // Price low to high check
        let initialPrice = 0;
        cy.get('.inventory_item_price').each(($el) => {
            let price = Number($el.text().replace('$', ''));
            expect(price).to.be.at.least(initialPrice);
            initialPrice = price;
        })
    })

    it('Verify the Standard_user user can perform a checkout', function () {
        cy.visit('/inventory.html', { failOnStatusCode: false })
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('[data-test="checkout"]').click()
        cy.enterCheckoutInformation(this.user.firstName, this.user.lastName, this.user.postalCode)
        cy.get('[data-test="finish"]').click()
        cy.get('.complete-text').should('have.text', this.user.completedText)
    })

})
