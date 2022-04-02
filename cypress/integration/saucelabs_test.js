/// <reference types="cypress" />

describe('Sauce Labs Test: Login', function () {

    beforeEach(() => {
        // Load fixture file fixtures/user.json
        cy.fixture('user').then(function (data) {
            this.user = data;
        })
    })

    it('Verify locked_out_user cannot login', function () {
        cy.login(this.user.invalidusername, this.user.password)
        // Verify that the user cannot log in and error message is displayed
        cy.get('[data-test="error"]').should('have.text', this.user.errorText)
    })

    it('Verify you can log in with user: Standard_user', function () {
        cy.login(this.user.username, this.user.password)
        // Verify the user is logged in
        cy.url().should('include', '/inventory.html')
    })

})

describe('Sauce Labs Test: Login, Add to Cart, Filter, Checkout', function () {

    beforeEach(function () {
        cy.fixture('user').then(function (data) {
            this.user = data;
        }).then(function () {
            // Pre-requsite: Users should be logged in before each test
            cy.loginwithSession(this.user.username, this.user.password)
            cy.visit('/inventory.html', { failOnStatusCode: false })
        })
    })

    it('Verify the Standard_user can add items to the card', function () {
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('.shopping_cart_link').click()
        // Verify the item is added to the cart
        cy.get('.inventory_item_name').should('have.text', 'Sauce Labs Backpack')
    })

    it('Verify the Standard_user user can filter the products', function () {
        cy.get('.product_sort_container').select('Price (low to high)');
        // Check price is low to high
        let initialPrice = 0;
        cy.get('.inventory_item_price').each(($el) => {
            let price = Number($el.text().replace('$', ''));
            expect(price).to.be.at.least(initialPrice);
            initialPrice = price;
        })
    })

    it('Verify the Standard_user user can perform a checkout', function () {
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('[data-test="checkout"]').click()
        cy.enterCheckoutInformation(this.user.firstName, this.user.lastName, this.user.postalCode)
        cy.get('[data-test="finish"]').click()
        // Verify the user can perform checkout
        cy.get('.complete-text').should('have.text', this.user.completedText)
    })

})
