import React from 'react'
import { useSelector } from 'react-redux'
import Systems from './Systems'
import Components from './Components'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LCCGraph from './LCCGraph'
import { System } from '../types'
import { clearPersistedStore } from '../store'

function LandingPage() {
  const customer = useSelector((state: { customer: string }) => state.customer)
  const systems = useSelector((state: { systems: System[] }) => state.systems)

  return (
    <Container className='procurement'>
      <Typography variant='h4' className='customer' onClick={clearPersistedStore}>
        {customer}
      </Typography>
      <Systems />
      {systems.length > 0 && (
        <>
          <LCCGraph />
          <Components />
        </>
      )}
    </Container>
  )
}

export default LandingPage
