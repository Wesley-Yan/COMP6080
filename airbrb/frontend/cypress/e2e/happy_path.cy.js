import 'cypress-file-upload';

describe('Happy flow', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
    });

    it('Successfully register an account', () => {
        // register a new account
        cy.get('#Register').click();
        const email = 'xiaoxiao@email.com';
        const password = 'password';
        const name = 'xiaoxiao';
        const text1 = "Landing Page";

        cy.get('input[name=email]').focus().type(email);
        cy.get('input[name=password]').focus().type(password);
        cy.get('input[name=name]').focus().type(name);
        cy.get('button[name=submit]').click();
  
        // get to landing page
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text1);
        });

        // get to hosted listing page
        const text2 = 'HostedListings'
        cy.get('#HostedListings').click();

        // Check that it is successful
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text2);
        });

        // get to create listing page
        const text3 = 'Create Listings'
        cy.get('#createListing').click();

        cy.get('h2').then((h2) => {
            expect(h2.text()).to.contain(text3);
        });

        // input fields to create listing
        const title = 'Big house';
        const street = '126 Banks Ave';
        const city = 'Sydney';
        const state = 'NSW';
        const postcode = '2036';
        const country = 'Australia';
        const price = 100;
        const propertyType = 'house';
        const numOfBath = 2;
        const numOfBed = 1;
        const king = 1;
        const queen = 1;
        const double = 1;
        const single = 1;
        const amenity = 'good house';
        const imgPath = '../../src/house.png';
        const text4 = 'HostedListings';
        cy.get('input[name=title').focus().type(title);
        cy.get('input[name=street').focus().type(street);
        cy.get('input[name=city').focus().type(city);
        cy.get('input[name=state').focus().type(state);
        cy.get('input[name=postcode').focus().type(postcode);
        cy.get('input[name=country').focus().type(country);
        cy.get('input[name=price').focus().type(price);
        cy.get('input[name=propertyType').focus().type(propertyType);
        cy.get('input[name=numOfBath').focus().type(numOfBath);
        cy.get('input[name=numOfBed').focus().type(numOfBed);
        cy.get('input[name=king').focus().type(king);
        cy.get('input[name=queen').focus().type(queen);
        cy.get('input[name=double').focus().type(double);
        cy.get('input[name=single').focus().type(single);
        cy.get('input[name=amenity').focus().type(amenity);
        cy.get('input[type="file"]').attachFile(imgPath);
        cy.get('#submit').click();
    
        // successful create a listing and return back to hosted listing page
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text4);
        });

        // publish a listing
        cy.get('#publish').click();
        const start = '2023-12-01';
        const end = '2023-12-30';
        cy.get('#start').focus().type(start);
        cy.get('#end').focus().type(end);
        cy.get('#submitPublish').click();

        // unpublish and publish a listing
        cy.get('#unpublish').click();
        cy.get('#publish').click();
        cy.get('#start').focus().type(start);
        cy.get('#end').focus().type(end);
        cy.get('#submitPublish').click();

        // logout current account
        cy.get('#Logout').click();
        cy.get('#Register').click();

        // create a new account
        const email2 = 'dada@email.com';
        const password2 = 'password2';
        const name2 = 'dada';

        cy.get('input[name=email]').focus().type(email2);
        cy.get('input[name=password]').focus().type(password2);
        cy.get('input[name=name]').focus().type(name2);
        cy.get('button[name=submit]').click();

        // book the listing published by the previous account
        cy.get('#book').click();

        const startDate = '2023-12-10';
        const endDate = '2023-12-12';

        cy.get('#start').focus().type(startDate);
        cy.get('#end').focus().type(endDate);
        cy.get('#submitBook').click();

        cy.get('#closeConfirm').click();

        // log out the current account
        cy.get('#Logout').click();

        // log in a registered account
        cy.get('#Login').click();
        cy.get('input[name=email]').focus().type(email);
        cy.get('input[name=password]').focus().type(password);
        cy.get('button[name=submit]').click();

        // succefully login and enter the landing page
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text1);
        });

        // logout current account
        cy.get('#Logout').click();
    });


});