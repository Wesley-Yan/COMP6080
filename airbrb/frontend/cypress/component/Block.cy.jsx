import React from 'react'
import { Block } from '../../src/components/Block'

describe('<Block />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <>
        <Block title={'Big house'} street={'126 Banks Ave'} city={'Sydney'} state={'NSW'} price={100} numOfBed={2} numOfBath={1}/>,
        <Block title={'Small house'} street={'125 Banks Ave'} city={'Sydney'} state={'NSW'} price={10} numOfBed={1} numOfBath={1}/>
      </>
    )
  })
})
