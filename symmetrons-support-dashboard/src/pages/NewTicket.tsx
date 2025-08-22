import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  subject: z.string().min(1),
  department: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().optional(),
  attachments: z.any().optional(),
})

type FormValues = z.infer<typeof schema>

export function NewTicket() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' }
  })

  async function onSubmit(values: FormValues) {
    const form = new FormData()
    form.append('subject', values.subject)
    form.append('department', values.department)
    form.append('priority', values.priority)
    if (values.description) form.append('description', values.description)

    const files: FileList | undefined = (values as any).attachments?.[0]?.files || (values as any).attachments
    if (files) {
      Array.from(files).forEach((f) => form.append('attachments[]', f))
    }

    await axios.post(import.meta.env.VITE_API_URL + '/tickets', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    navigate('/tickets')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white border rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input className="mt-1 w-full border rounded px-3 py-2" {...register('subject')} />
        {errors.subject && <p className="text-sm text-red-600">Subject is required</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input className="mt-1 w-full border rounded px-3 py-2" {...register('department')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select className="mt-1 w-full border rounded px-3 py-2" {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea rows={5} className="mt-1 w-full border rounded px-3 py-2" {...register('description')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Attachments</label>
        <input type="file" multiple className="mt-1" {...register('attachments')} />
        <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
      </div>
      <div className="flex justify-end">
        <button disabled={isSubmitting} className="bg-brand-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  )
}