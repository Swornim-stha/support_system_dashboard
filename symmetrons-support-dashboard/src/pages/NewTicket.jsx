import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../NewTicket.css"; // import the CSS

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  subject: z.string().min(1, "Subject is required."),
  department: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().optional(),
  // attachments: z.any().optional(),
  attachments: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      // If no files are selected, validation passes (due to .optional())
      if (!files || files.length === 0) return true;
      // Check if all files are within the size limit
      return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
    }, `Max file size is 5MB.`)
    .refine((files) => {
      // If no files are selected, validation passes
      if (!files || files.length === 0) return true;
      // Check if all files have an accepted file type
      return Array.from(files).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
});

export function NewTicket() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    // defaultValues: { priority: '' }
  });

  async function onSubmit(values) {
    const form = new FormData();
    form.append("subject", values.subject);
    form.append("department", values.department);
    form.append("priority", values.priority);
    if (values.description) form.append("description", values.description);

    const files = values.attachments;
    if (files) {
      Array.from(files).forEach((f) => form.append("attachments[]", f));
    }

    await axios.post(import.meta.env.VITE_API_URL + "/tickets", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/tickets");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ticket-form">
      <div>
        <label>Subject</label>
        <input type="text" {...register("subject")} />
        {errors.subject && <p className="text-red">Subject is required</p>}
      </div>

      <div className="form-grid">
        <div>
          <label>Department</label>
          <select {...register("department")}>
            <option value="">Select department</option>
            <option value="IT">IT Support</option>
            <option value="HR">HR Support</option>
            <option value="Admin">Admin Support</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select {...register("priority")}>
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
        <textarea rows={5} {...register("description")} />
      </div>

      <div>
        <label>Attachments</label>
        <input type="file" multiple {...register("attachments")} />
        <p className="text-xs">Max 5 MB per file</p>
        {errors.attachments && (
          <p className="error-message">{errors.attachments.message}</p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </div>
    </form>
  );
}
