import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../NewTicket.css' // import the CSS

const schema = z.object({
  subject: z.string().min(1),
  department: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().optional(),
  attachments: z.any().optional(),
})

export function NewTicket() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    // defaultValues: { priority: '' }
  })

  async function onSubmit(values) {
    const form = new FormData()
    form.append('subject', values.subject)
    form.append('department', values.department)
    form.append('priority', values.priority)
    if (values.description) form.append('description', values.description)

    const files = values.attachments
    if (files) {
      Array.from(files).forEach((f) => form.append('attachments[]', f))
    }

    await axios.post(import.meta.env.VITE_API_URL + '/tickets', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    navigate('/tickets')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ticket-form">
      <div>
        <label>Subject</label>
        <input type="text" {...register('subject')} />
        {errors.subject && <p className="text-red">Subject is required</p>}
      </div>

      <div className="form-grid">
        <div>
          <label>Department</label>
          <select {...register('department')}>
            <option value="">Select department</option>
            <option value="IT">IT Support</option>
            <option value="HR">HR Support</option>
            <option value="Admin">Admin Support</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select {...register('priority')}>
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label>Description</label>
        <textarea rows={5} {...register('description')} />
      </div>

      <div>
        <label>Attachments</label>
        <input type="file" multiple {...register('attachments')} />
        <p className="text-xs">Max 10MB per file</p>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  )
}
