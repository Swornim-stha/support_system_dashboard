import { NavLink, Route, Routes } from 'react-router-dom'
import { useMemo } from 'react'
import { TicketDashboard } from './pages/TicketDashboard'
import { TicketList } from './pages/TicketList'
import { NewTicket } from './pages/NewTicket'

function App() {
  const navLinkClass = useMemo(() => ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
  , [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-brand-600 text-white grid place-items-center font-bold">FS</div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Four Symmetrons</h1>
              <p className="text-xs text-gray-500">Support System Dashboard</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
            <NavLink to="/tickets" className={navLinkClass}>Tickets</NavLink>
            <NavLink to="/new" className={navLinkClass}>New Ticket</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route index element={<TicketDashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/new" element={<NewTicket />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
