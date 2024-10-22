import { useSelector } from 'react-redux'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
import { System } from '../types'
import { Container } from '@mui/material'
import SectionHeader from './SectionHeader'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid'
import { getFormattedCurrencyValue } from './CurrencyFormatter'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const LCCGraph: React.FC = () => {
  const period = useSelector((state: { period: number }) => state.period)
  const currency = useSelector((state: { currency: string }) => state.currency)
  const systems = useSelector((state: { systems: System[] }) => state.systems)
  const winner = [...systems]?.sort((a, b) => a.cumulative - b.cumulative)[0]
  const series = systems.map((system, index) => {
    return {
      data: system.dataset || [],
      color: system.color,
      label: system.product,
      showMark: false,
      valueFormatter: (value: number | null) => getFormattedCurrencyValue(value || 0, currency)
    }
  })

  const years = {
    data: Array.from({ length: period }, (_, i) => i + 1),
    scaleType: 'time'
  }

  return (
    <Container className='section'>
      <SectionHeader title='Cost Projection'>
        {systems.length > 1 && (
          <div className='winner'>
            <EmojiEventsIcon style={{ marginRight: 8 }} /> {winner.product}
          </div>
        )}
      </SectionHeader>
      <LineChart
        xAxis={[
          {
            data: years.data,
            tickInterval: years.data.filter((_, index) => (index + 1) % 5 === 0),
            labelStyle: { fontSize: 16 }
          }
        ]}
        yAxis={[
          {
            valueFormatter: (value: number) => `${value / 1000}k`,
            tickMinStep: 75000
          }
        ]}
        bottomAxis={{
          tickLabelStyle: { fontSize: '1rem', fontWeight: '700' },
          disableTicks: false,
          disableLine: false
        }}
        slotProps={{ legend: { hidden: true } }}
        leftAxis={{ tickLabelStyle: { fontSize: '1rem', fontWeight: '700' }, disableTicks: true, disableLine: true }}
        series={series}
        margin={{ left: 84, right: 36, top: 16, bottom: 48 }}
        height={320}
        grid={{ vertical: false, horizontal: true }}
        sx={{
          [`.${lineElementClasses.root}`]: {
            strokeWidth: 4
          },
          [`& .${axisClasses.directionX} .${axisClasses.tickLabel}`]: {
            transform: 'translateY(16px)'
          },
          [`& .${axisClasses.directionY} .${axisClasses.tickLabel}`]: {
            transform: 'translateX(-12px)'
          },
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: '#eee',
              strokeWidth: 3
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: 'rgba(0,0,0,0.33)'
            }
          },
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: '6 8', strokeWidth: 2 }
        }}></LineChart>
    </Container>
  )
}

export default LCCGraph
