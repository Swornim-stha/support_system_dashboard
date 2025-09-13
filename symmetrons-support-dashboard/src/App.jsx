import { NavLink, Route, Routes } from 'react-router-dom'
import { useMemo } from 'react'
import { TicketDashboard } from './pages/TicketDashboard'
import { TicketList } from './pages/TicketList'
import { NewTicket } from './pages/NewTicket'
import { AdminPanel } from './pages/Adminpannel'
import './Navbar.css';

function App() {
  const navLinkClass = useMemo(
    () => ({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`,
    []
  )

  return (
   <div className="app-container">
  <header className="app-header">
    <div className="header-inner">
      <div className="brand-container">
        <img src="logo.png" alt="Symmetrons Support" className="logo" />
        <div className="brand-name">
          <span className="brand-name-part1">Four</span>
          <span className="brand-name-part2">Symmetrons</span>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={navLinkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/tickets" className={navLinkClass}>
          Tickets
        </NavLink>
        <NavLink to="/new" className={navLinkClass}>
          New Ticket
        </NavLink>
        <NavLink to="/admin" className={navLinkClass}>
          Admin
        </NavLink>
      </nav>
    </div>
  </header>

  <main className="app-main">
    <Routes>
      <Route index element={<TicketDashboard />} />
      <Route path="/tickets" element={<TicketList />} />
      <Route path="/new" element={<NewTicket />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  </main>
</div>

  )
}

export default App
