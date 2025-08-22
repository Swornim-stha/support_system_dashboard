import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((i) => (
        <div key={i.label} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500">{i.label}</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{i.value}</div>
        </div>
      ))}
    </div>
  )
}