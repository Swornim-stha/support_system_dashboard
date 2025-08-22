import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

interface Ticket {
  id: number
  subject: string
  department: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
}

export function TicketList() {
  const [params, setParams] = useSearchParams()

  const { data } = useQuery({
    queryKey: ['tickets', params.toString()],
    queryFn: async () => {
      const url = new URL(import.meta.env.VITE_API_URL + '/tickets')
      params.forEach((v, k) => url.searchParams.set(k, v))
      const res = await axios.get(url.toString())
      return res.data as { data: Ticket[] }
    },
  })

  const tickets = data?.data ?? []

  function onFilterChange(name: string, value: string) {
    if (value) params.set(name, value)
    else params.delete(name)
    setParams(params)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500">Status</label>
          <select className="mt-1 border rounded px-2 py-1" value={params.get('status') ?? ''} onChange={(e) => onFilterChange('status', e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Priority</label>
          <select className="mt-1 border rounded px-2 py-1" value={params.get('priority') ?? ''} onChange={(e) => onFilterChange('priority', e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Department</label>
          <input className="mt-1 border rounded px-2 py-1" value={params.get('department') ?? ''} onChange={(e) => onFilterChange('department', e.target.value)} />
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Department</th>
              <th className="text-left p-3">Priority</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">#{t.id}</td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3">{t.department}</td>
                <td className="p-3 capitalize">
                  <span className={{ low: 'text-green-700', medium: 'text-yellow-700', high: 'text-orange-700', urgent: 'text-red-700' }[t.priority]}>{t.priority}</span>
                </td>
                <td className="p-3 capitalize">{t.status.replace('_', ' ')}</td>
                <td className="p-3">{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>No tickets</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}