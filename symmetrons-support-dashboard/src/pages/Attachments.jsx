import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function AttachmentList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["attachments"],
    queryFn: async () => {
      // ✅ FIX 1: Make sure to include /api/ in the URL
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attachments`
      );
      return res.data;
    },
  });

  if (isLoading) return <div>Loading attachments...</div>;
  if (error) return <div>Error loading attachments</div>;

  // ✅ FIX 2: Handle both plain array & paginated response
  const attachments = Array.isArray(data) ? data : data?.data ?? [];

  return (
    <div className="attachment-list">
      <h2>Attachments</h2>
      {attachments.length === 0 ? (
        <p>No attachments found</p>
      ) : (
        <table className="attachment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ticket ID</th>
              <th>Original Name</th>
              <th>File</th>
              <th>Size</th>
              <th>MIME Type</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>#{a.ticket_id}</td>
                <td>{a.original_name}</td>
                <td>
                  {/* ✅ FIX 3: Prefer `url` if API returns it, otherwise build manually */}
                  <a
                    href={
                      a.url
                        ? a.url
                        : `${import.meta.env.VITE_API_URL}/storage/${a.path}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {a.original_name || "View"}
                  </a>
                </td>
                <td>
                  {a.size_bytes
                    ? `${(a.size_bytes / 1024).toFixed(1)} KB`
                    : "-"}
                </td>
                <td>{a.mime_type || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
