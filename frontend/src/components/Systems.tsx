import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { System } from '../types'
import FileUploadButton from './FileUploadButton'
import SystemIcon from './SystemIcon'
import SectionHeader from './SectionHeader'
import { getFormattedCurrencyValue } from './CurrencyFormatter'
import { removeSystem } from '../store'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

const Systems: React.FC = () => {
  const systems = useSelector((state: { systems: System[] }) => state.systems)
  const sortedSystems = [...systems]?.sort((a, b) => a.cumulative - b.cumulative) // Create a shallow copy
  const hasSystems = sortedSystems?.length > 0
  const currency = useSelector((state: { currency: string }) => state.currency)
  const systemType = useSelector((state: { systemType: string }) => state.systemType)
  const dispatch = useDispatch()
  return (
    <Container className='section'>
      <SectionHeader title={`${systemType}s`}>
        <FileUploadButton />
      </SectionHeader>
      {hasSystems ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='name' colSpan={2}>
                  Name
                </TableCell>
                <TableCell>Acquisition Cost</TableCell>
                <TableCell>Annual Cost</TableCell>
                <TableCell>Cumulative Cost</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSystems.map((system, index) => (
                <TableRow key={index}>
                  <TableCell className='icon' style={{ paddingLeft: 24 }}>
                    <SystemIcon color={system.color} />
                  </TableCell>
                  <TableCell className='system'>{system.product}</TableCell>
                  <TableCell>{getFormattedCurrencyValue(system.acquisition, currency)}</TableCell>
                  <TableCell>{getFormattedCurrencyValue(system.annual, currency)}</TableCell>
                  <TableCell className='cumulative'>{getFormattedCurrencyValue(system.cumulative, currency)}</TableCell>
                  <TableCell className='action'>
                    <IconButton
                      onClick={() => dispatch(removeSystem({ systemId: system.product }))}
                      style={{ color: 'rgba(0,0,0,.3)' }}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography className='noData'>Nothing to see here at the moment</Typography>
      )}
    </Container>
  )
}

export default Systems
