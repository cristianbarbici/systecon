import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

interface SectionHeaderProps {
  title: string
  children?: React.ReactNode
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, children }) => (
  <Container className='sectionHeader'>
    <Typography variant='h5'>{title}</Typography>
    {children}
  </Container>
)

export default SectionHeader
