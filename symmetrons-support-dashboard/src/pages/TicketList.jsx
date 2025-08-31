import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import '../TicketList.css' // import the CSS

export function TicketList() {
  const [params, setParams] = useSearchParams()

  const { data } = useQuery({
    queryKey: ['tickets', params.toString()],
    queryFn: async () => {
      const url = new URL(import.meta.env.VITE_API_URL + '/tickets')
      params.forEach((v, k) => url.searchParams.set(k, v))
      const res = await axios.get(url.toString())
      return res.data
    },
  })

  const tickets = data?.data ?? []

  function onFilterChange(name, value) {
    if (value) params.set(name, value)
    else params.delete(name)
    setParams(params)
  }

  return (
    <div className="ticket-list">
      <div className="filter-bar">
        <div className="filter-item">
          <label>Status</label>
          <select
            value={params.get('status') ?? ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Priority</label>
          <select
            value={params.get('priority') ?? ''}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Department</label>
          <input
            value={params.get('department') ?? ''}
            onChange={(e) => onFilterChange('department', e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{t.subject}</td>
                <td>{t.department}</td>
                <td className={`priority-${t.priority}`}>{t.priority}</td>
                <td>{t.status.replace('_', ' ')}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td className="no-tickets" colSpan="6">
                  No tickets
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
