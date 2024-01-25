import React from 'react'
import Login from '../../src/components/loginForm'

describe('<Login />', () => {
  // check loginForm
  it('renders', () => {
    // pass 2 parameters to Login components
    cy.mount(<Login e={'email'} p={'password'}/>)

    // check outputs 2 input fields
    cy.get('input').should('have.length', 2);

    // check the correct parameters are ouput
    cy.get('input[name=email]').should('have.value', 'email');
    cy.get('input[name=password]').should('have.value', 'password');
  })
})
