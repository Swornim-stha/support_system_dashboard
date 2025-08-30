import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import '../TicketDashboard.css' // import the CSS

export function TicketDashboard() {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/tickets/stats')
      return res.data as { total: number; open: number; resolved_today: number; urgent: number }
    },
  })

  const stats = data ?? { total: 0, open: 0, resolved_today: 0, urgent: 0 }

  const items = [
    { label: 'Total Tickets', value: stats.total },
    { label: 'Open', value: stats.open },
    { label: 'Resolved Today', value: stats.resolved_today },
    { label: 'Urgent', value: stats.urgent },
  ]

  return (
    <div className="dashboard-grid">
      {items.map((i) => (
        <div key={i.label} className="dashboard-card">
          <div className="dashboard-label">{i.label}</div>
          <div className="dashboard-value">{i.value}</div>
        </div>
      ))}
    </div>
  )
}
