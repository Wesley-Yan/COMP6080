import React from 'react'
import { Review } from '../../src/components/Review'

describe('<Review />', () => {
  it('renders', () => {
    cy.mount(
      <>
        <Review score={Number(5)} comments={'good'} />
        <Review score={Number(2)} comments={'just so so'} />
        <Review score={Number(0)} comments={'bad'} />
      </>
    );
  })
})
