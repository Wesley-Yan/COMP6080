import 'cypress-file-upload';

describe('Happy flow', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
    });

    it('Successfully register an account', () => {
        cy.get('#Register').click();

        // register error
        const text = "ErrorPage!";
        cy.get('button[name=submit]').click();
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text);
        });
        cy.get('#close').click();

        // successfully register a new account
        const email = 'zhongzhong@email.com';
        const password = 'password';
        const name = 'zhongzhong';
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

        // create listing error: do not fill in all fields
        cy.get('#submit').click();
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text);
        });
        cy.get('#close').click();

        // input fields to create listing
        const title = 'Small house';
        const street = '125 Banks Ave';
        const city = 'Sydney';
        const state = 'NSW';
        const postcode = '2036';
        const country = 'Australia';
        const price = 10;
        const propertyType = 'house';
        const numOfBath = 1;
        const numOfBed = 1;
        const king = 0;
        const queen = 0;
        const double = 0;
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

        // publish error: not fill in start and/or end date
        cy.get('#publish').click();
        cy.get('#submitPublish').click();
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text);
        });
        cy.get('#close').click();


        //successfully publish a listing
        cy.get('#publish').click();
        const start = '2023-12-01';
        const end = '2023-12-30';
        cy.get('#start').focus().type(start);
        cy.get('#end').focus().type(end);
        cy.get('#submitPublish').click();

        // logout current account
        cy.get('#Logout').click();

        // login error: invalid password
        cy.get('#Login').click();
        cy.get('input[name=email]').focus().type(email);
        cy.get('input[name=password]').focus().type(password + 'aaa');
        cy.get('button[name=submit]').click();
        cy.get('h1').then((h1) => {
            expect(h1.text()).to.contain(text);
        });
        cy.get('#close').click();

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
    })

});