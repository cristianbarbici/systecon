import React from 'react'
import { useSelector } from 'react-redux'
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { System, Component } from '../types'
import SectionHeader from './SectionHeader'
import SystemIcon from './SystemIcon'
import { getFormattedCurrencyValue } from './CurrencyFormatter'

const Components: React.FC = () => {
  const components = useSelector((state: { components: Component[] }) => state.components)
  const systems = useSelector((state: { systems: System[] }) => state.systems)
  const currency = useSelector((state: { currency: string }) => state.currency)

  const getSystemColor = (systemName: string) => {
    const system = systems.find((system) => system.product === systemName)
    return system ? system.color : '#FFFFFF'
  }

  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.part]) {
      acc[component.part] = { ...component, cumulative: 0 }
    }
    acc[component.part].cumulative += component.cumulative
    return acc
  }, {} as Record<string, Component>)

  const sortedGroups = Object.values(groupedComponents).sort((a, b) => b.cumulative - a.cumulative)

  return (
    <Container className='section'>
      <SectionHeader title='Components Analysis' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='name' colSpan={2}>
                Name
              </TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Failure Rate</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Annual Cost</TableCell>
              <TableCell style={{ paddingRight: 24 }}>Cumulative Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedGroups.map((group) => {
              const groupComponents = components
                .filter((component) => component.part === group.part)
                .sort((a, b) => a.cumulative - b.cumulative)

              return (
                <React.Fragment key={group.part}>
                  {groupComponents.map((component, index) => {
                    const lastInGroup = index === groupComponents.length - 1
                    const groupItem = index < groupComponents.length - 1
                    return (
                      <TableRow key={index}>
                        <TableCell className={`component${lastInGroup ? ' lastInGroup' : ''}`}>
                          {index === 0 ? component.part : ''}
                        </TableCell>
                        <TableCell className={`icon${lastInGroup ? ' lastInGroup' : ''}`}>
                          <SystemIcon color={getSystemColor(component.system)} />
                        </TableCell>
                        <TableCell className={lastInGroup ? 'lastInGroup' : groupItem ? 'groupItem' : ''}>
                          {component.quantity}
                        </TableCell>
                        <TableCell className={lastInGroup ? 'lastInGroup' : groupItem ? 'groupItem' : ''}>
                          {component.failureRate}
                        </TableCell>
                        <TableCell className={lastInGroup ? 'lastInGroup' : groupItem ? 'groupItem' : ''}>
                          {getFormattedCurrencyValue(component.price, currency)}
                        </TableCell>
                        <TableCell className={lastInGroup ? 'lastInGroup' : groupItem ? 'groupItem' : ''}>
                          {getFormattedCurrencyValue(component.annual, currency)}
                        </TableCell>
                        <TableCell
                          className={`cumulative${lastInGroup ? ' lastInGroup' : groupItem ? ' groupItem' : ''}`}>
                          {getFormattedCurrencyValue(component.cumulative, currency)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Components
