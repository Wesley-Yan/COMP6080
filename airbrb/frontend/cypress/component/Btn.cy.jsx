import React from 'react'
import { Btn } from '../../src/components/Btn'

describe('<Btn />', () => {
  // check Btn component
  it('renders', () => {
    // click add button and output a new text input
    cy.mount(<Btn />)
    cy.get('#addInput').click();
    cy.get('#addInput').click();

    // check the number of input fields is correct
    cy.get('input').should('have.length', 2);
  })
})
