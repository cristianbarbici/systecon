import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { addSystem } from '../store'
import { System } from '../types'
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function FileUploadButton() {
  const dispatch = useDispatch()
  const backend = useSelector((state: { backend: string }) => state.backend)
  const existingSystems = useSelector((state: { systems: System[] }) => state.systems)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        try {
          const response = await fetch(backend, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            alert('Error uploading file: ' + response.statusText)
            console.error('Error uploading file:', response.statusText)
            continue
          }

          const { system, components } = await response.json()
          const systemExists = existingSystems.some((existingSystem) => existingSystem.product === system.product)
          if (systemExists) {
            alert(`${system.product} already exists`)
            console.error(`${system.product} already exists`)
            continue
          }

          dispatch(addSystem({ system, components }))
        } catch (error) {
          console.error('Error uploading file:', error)
        }
      }
    }
  }

  return (
    <Button
      component='label'
      role={undefined}
      variant='outlined'
      size='medium'
      tabIndex={-1}
      startIcon={<AddIcon />}
      style={{ borderRadius: '16px', padding: '2px 12px' }}>
      Add
      <VisuallyHiddenInput type='file' onChange={handleFileChange} multiple />
    </Button>
  )
}
