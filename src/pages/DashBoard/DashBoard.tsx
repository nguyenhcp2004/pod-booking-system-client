import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import DashboardMain from '~/pages/DashBoard/DashBoardMain'

export default function Dashboard() {
  return (
    <main style={{ display: 'grid', gap: '1rem', flexGrow: 1 }}>
      <div>
        <Card>
          <CardHeader title={<Typography variant='h6'>Dashboard</Typography>} subheader='Phân tích các chỉ số' />
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
