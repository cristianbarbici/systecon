import React from 'react'
import CircleIcon from '@mui/icons-material/Circle'

const SystemIcon: React.FC<{ color: string }> = ({ color }) => (
  <CircleIcon style={{ color: color, display: 'block', height: 20, width: 20 }} />
)

export default SystemIcon
