import React from 'react'
import { GetBeroomdetail } from '../../src/components/GetBedroomDetaill'

describe('<GetBeroomdetail />', () => {
  // check input of #beds and output corresponding #beds of 4 types
  it('renders', () => {
    // case of 2 bedrooms, total 8 beds
    let number = 2;
    cy.mount(<GetBeroomdetail />)
    cy.get('input[name=numOfBed]').focus().type(number);
    cy.get('input').should('have.length', 9);

    // case of 3 bedrooms, total 12 beds
    number = 3;
    cy.mount(<GetBeroomdetail />)
    cy.get('input[name=numOfBed]').focus().type(number);
    cy.get('input').should('have.length', 13);

    // case of 1 bedroom, total 4 beds
    number = 1;
    cy.mount(<GetBeroomdetail />)
    cy.get('input[name=numOfBed]').focus().type(number);
    cy.get('input').should('have.length', 5);
  })
})
