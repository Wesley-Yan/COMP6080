import React from 'react'
import { Filter } from '../../src/components/Filter'

describe('<filter />', () => {
  it('renders', () => {
    // click open filter
    cy.mount(<Filter />)
    cy.get('#open').click();

    // type in keyword input
    const keyword = 'keyword'
    cy.get('#keyword').focus().type(keyword);
    cy.get('#keyword').should('have.value', 'keyword');

    // reset filter
    cy.get('#reset').click();
    cy.get('#keyword').should('have.value', '');

    // close filter dialog
    cy.get('#close').click();
    cy.get('input').should('have.length', 0);
  })
})
