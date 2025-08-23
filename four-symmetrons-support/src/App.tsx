import { useEffect, useMemo, useState } from 'react'

// Types
type Ticket = {
	id: string
	subject: string
	description: string
	priority: 'low' | 'medium' | 'high' | 'urgent'
	status: 'new' | 'in-progress' | 'resolved' | 'pr'
	department: 'IT Support' | 'HR Support' | 'Finance Support' | 'Admin Support'
	created: string
	assigned: string
	comments: Array<{ author: string; time: string; text: string; avatar?: string }>
	attachments: Array<{ id: string; original_name: string; file_path: string }>
}

const PRIORITY_BADGE: Record<Ticket['priority'], string> = {
	low: 'bg-green-100 text-green-800',
	medium: 'bg-yellow-100 text-yellow-800',
	high: 'bg-orange-100 text-orange-800',
	urgent: 'bg-red-100 text-red-800',
}

const STATUS_BADGE: Record<Ticket['status'], string> = {
	new: 'bg-blue-100 text-blue-800',
	'in-progress': 'bg-yellow-100 text-yellow-800',
	resolved: 'bg-green-100 text-green-800',
	pr: 'bg-indigo-100 text-indigo-800',
}

function formatStatus(status: Ticket['status']) {
	if (status === 'in-progress') return 'In Progress'
	if (status === 'pr') return 'Pending Review'
	return status.charAt(0).toUpperCase() + status.slice(1)
}

function generateTicketId(previousId?: string) {
	if (!previousId) return 'TKT-000001'
	const last = parseInt(previousId.split('-')[1] || '0') || 0
	const next = String(last + 1).padStart(6, '0')
	return `TKT-${next}`
}

function TicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
	return (
		<div className="fixed z-10 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
				<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
				<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-lg leading-6 font-medium text-gray-900">Ticket Details</h3>
								<div className="mt-1 flex items-center space-x-2">
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_BADGE[ticket.priority]}`}>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[ticket.status]}`}>{formatStatus(ticket.status)}</span>
									<span className="text-sm text-gray-500">{ticket.id}</span>
								</div>
							</div>
							<button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
							</button>
						</div>
						<div className="mt-4">
							<h4 className="text-xl font-medium text-gray-900">{ticket.subject}</h4>
							<div className="mt-2"><p className="text-gray-600">{ticket.description}</p></div>
							<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
								<div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Created</label><div className="mt-1 text-sm text-gray-900">{ticket.created}</div></div>
								<div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Department</label><div className="mt-1 text-sm text-gray-900">{ticket.department}</div></div>
								<div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Assigned To</label><div className="mt-1 text-sm text-gray-900">{ticket.assigned}</div></div>
							</div>
							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-700">Comments</label>
								<div className="mt-2 space-y-4">
									{ticket.comments.length === 0 ? (
										<p className="text-sm text-gray-500">No comments yet</p>
									) : (
										ticket.comments.map((c, idx) => (
											<div key={idx} className="flex space-x-3">
												<div className="flex-shrink-0">
													<img className="h-10 w-10 rounded-full" src={c.avatar || '/avatar.png'} alt={c.author} />
												</div>
												<div>
													<div className="flex items-center space-x-1">
														<p className="text-sm font-medium text-gray-900">{c.author}</p>
														<p className="text-sm text-gray-500">{c.time}</p>
													</div>
													<div className="mt-1 text-sm text-gray-700"><p>{c.text}</p></div>
												</div>
											</div>
										))
									)}
								</div>
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function App() {
	// Seed with some example tickets
	const [tickets, setTickets] = useState<Ticket[]>(() => {
		const now = new Date()
		const iso = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
		return [
			{
				id: 'TKT-000001',
				subject: 'Email not syncing on Outlook',
				description: 'Outlook fails to sync since morning after VPN change.',
				priority: 'high',
				status: 'in-progress',
				department: 'IT Support',
				created: iso,
				assigned: 'John Smith',
				comments: [],
				attachments: [],
			},
			{
				id: 'TKT-000002',
				subject: 'Payslip not accessible',
				description: 'Unable to download payslip from portal.',
				priority: 'medium',
				status: 'new',
				department: 'HR Support',
				created: iso,
				assigned: 'Unassigned',
				comments: [],
				attachments: [],
			},
		]
	})

	const [showForm, setShowForm] = useState(false)
	const [modalTicket, setModalTicket] = useState<Ticket | null>(null)

	// Pagination
	const pageSize = 5
	const [page, setPage] = useState(1)
	const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize))
	useEffect(() => {
		if (page > totalPages) setPage(totalPages)
	}, [tickets.length, page, totalPages])

	const pageSlice = useMemo(() => {
		const start = (page - 1) * pageSize
		return tickets.slice(start, start + pageSize)
	}, [tickets, page])

	// Stats
	const openCount = useMemo(() => tickets.filter(t => ['new', 'pr'].includes(t.status)).length, [tickets])
	const resolvedToday = useMemo(() => tickets.filter(t => t.status === 'resolved').length, [tickets])
	const urgentCount = useMemo(() => tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length, [tickets])

	// Form state
	const [subject, setSubject] = useState('')
	const [department, setDepartment] = useState<Ticket['department']>('IT Support')
	const [priority, setPriority] = useState<Ticket['priority']>('low')
	const [description, setDescription] = useState('')
	const [files, setFiles] = useState<File[]>([])

	function handleCreateTicket(e: React.FormEvent) {
		e.preventDefault()

		const newId = generateTicketId(tickets[0]?.id)
		const now = new Date()
		const created = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

		const newTicket: Ticket = {
			id: newId,
			subject: subject.trim(),
			description: description.trim(),
			priority,
			status: 'new',
			department,
			created,
			assigned: 'Unassigned',
			comments: [],
			attachments: files.map((f, idx) => ({ id: `att-${Date.now()}-${idx}`, original_name: f.name, file_path: '' })),
		}

		if (!newTicket.subject) return
		setTickets(prev => [newTicket, ...prev])
		setShowForm(false)
		setSubject('')
		setDepartment('IT Support')
		setPriority('low')
		setDescription('')
		setFiles([])
	}

	return (
		<div className="min-h-screen">
			{/* Nav */}
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<div className="flex-shrink-0 flex items-center">
								<img src="/logo.png" alt="Four Symmetrons logo" className="h-8 w-auto" />
								<div className="namelogo">
									<span className="ml-2 mb-0 text-xl font-semibold text-gray-900 text-orange-500">Four </span>
									<br />
									<span className="ml-2 text-xl font-semibold text-blue-500">Symmetrons</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Main */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Welcome and Stats */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Support System Dashboard</h1>
					<p className="text-gray-600 mb-6">Submit, track, and manage your technical support requests</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
									</svg>
								</div>
								<div className="ml-4">
									<h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
									<p className="text-2xl font-semibold text-gray-900">{openCount}</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="p-3 rounded-full bg-green-50 text-green-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<div className="ml-4">
									<h3 className="text-sm font-medium text-gray-500">Resolved Today</h3>
									<p className="text-2xl font-semibold text-gray-900">{resolvedToday}</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex items-center">
								<div className="p-3 rounded-full bg-red-50 text-red-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<div className="ml-4">
									<h3 className="text-sm font-medium text-gray-500">Urgent Tickets</h3>
									<p className="text-2xl font-semibold text-gray-900">{urgentCount}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Ticket Creation Form */}
				{showForm && (
					<div className="bg-white rounded-lg shadow overflow-hidden mb-8">
						<div className="px-6 py-5 border-b border-gray-200">
							<h2 className="text-lg font-medium text-gray-900">Create New Support Ticket</h2>
						</div>
						<div className="px-6 py-4">
							<form onSubmit={handleCreateTicket} className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-3">
									<label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
									<input id="subject" required value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
								</div>

								<div className="col-span-6 sm:col-span-3">
									<label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
									<select id="department" value={department} onChange={e => setDepartment(e.target.value as Ticket['department'])} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
										<option>IT Support</option>
										<option>HR Support</option>
										<option>Finance Support</option>
										<option>Admin Support</option>
									</select>
								</div>

								<div className="col-span-6 sm:col-span-3">
									<label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
									<select id="priority" value={priority} onChange={e => setPriority(e.target.value as Ticket['priority'])} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
										<option value="urgent">Urgent</option>
									</select>
								</div>

								<div className="col-span-6">
									<label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
									<textarea id="description" required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
								</div>

								<div className="col-span-6">
									<label className="block text-sm font-medium text-gray-700">Attachments</label>
									<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
										<div className="space-y-1 text-center">
											<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
												<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											<div className="flex text-sm text-gray-600 justify-center">
												<label htmlFor="attachments" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
													<span>Upload files</span>
													<input id="attachments" name="attachments" type="file" className="sr-only" multiple onChange={e => setFiles(Array.from(e.target.files || []))} />
												</label>
												<p className="pl-1">or drag and drop</p>
											</div>
											<p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC up to 10MB</p>
											{files.length > 0 && (
												<p className="text-xs text-gray-700 mt-2">{files.length} file(s) selected</p>
											)}
										</div>
									</div>
								</div>

								<div className="col-span-6 flex justify-end mt-6 space-x-3">
									<button type="button" onClick={() => setShowForm(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
									<button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit Ticket</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Ticket List */}
				<div className="bg-white shadow overflow-hidden sm:rounded-lg">
					<div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
						<div>
							<h3 className="text-lg leading-6 font-medium text-gray-900">Your Support Tickets</h3>
							<p className="mt-1 max-w-2xl text-sm text-gray-500">All your recent support requests</p>
						</div>
						<button onClick={() => setShowForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							New Ticket
						</button>
					</div>

					<div className="divide-y divide-gray-200">
						{pageSlice
							.filter(t => t.subject && t.subject.trim() !== '')
							.map(ticket => (
								<div key={ticket.id} className="ticket-card px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => setModalTicket(ticket)}>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="min-w-0 flex-1">
												<div className="flex items-center">
													<p className="text-sm font-medium text-indigo-600 truncate mr-2">{ticket.subject}</p>
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[ticket.status]} ${ticket.priority === 'urgent' ? 'ring-1 ring-red-300' : ''}`}>
														{formatStatus(ticket.status)}
													</span>
												</div>
												<div className="mt-1 flex items-center">
													<p className="text-sm text-gray-500 truncate">Created {ticket.created} in {ticket.department}</p>
													{ticket.attachments.length > 0 && (
														<span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
															{ticket.attachments.length} files
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="ml-4 flex-shrink-0">
											<div className="flex items-center">
												<span className="text-sm text-gray-500 mr-2">{ticket.id}</span>
												<svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
													<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
												</svg>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>

					{/* Pagination */}
					<div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div className="flex-1 flex justify-between sm:hidden">
							<button onClick={() => setPage(p => Math.max(1, p - 1))} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
							<button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, tickets.length)}</span> of <span className="font-medium">{tickets.length}</span> results
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
									<button onClick={() => setPage(p => Math.max(1, p - 1))} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
										<span className="sr-only">Previous</span>
										<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
									</button>
									{Array.from({ length: totalPages }).map((_, i) => {
										const pageNum = i + 1
										const active = pageNum === page
										return (
											<button key={pageNum} onClick={() => setPage(pageNum)} className={`${active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} relative inline-flex items-center px-4 py-2 border text-sm font-medium`}>
												{pageNum}
											</button>
										)
									})}
									<button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
										<span className="sr-only">Next</span>
										<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Modal */}
			{modalTicket && <TicketModal ticket={modalTicket} onClose={() => setModalTicket(null)} />}
		</div>
	)
}
