import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../Pagination";
import "../Adminpannel.css";

export function AdminPanel() {
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Fetch tickets
  const { data, isLoading } = useQuery({
    queryKey: ["tickets", params.toString()],
    queryFn: async () => {
      // Set defaults for pagination if not present
      if (!params.has("page")) params.set("page", "1");
      if (!params.has("limit")) params.set("limit", "10"); // You might adjust this default

      const url = new URL(import.meta.env.VITE_API_URL + "/tickets");
      params.forEach((v, k) => url.searchParams.set(k, v));
      const res = await axios.get(url.toString());
      return res.data;
    },
    keepPreviousData: true,
  });

  const tickets = data?.data ?? [];
  const meta = data;

  // Mutation for updating status
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axios.put(`${import.meta.env.VITE_API_URL}/tickets/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  // Updated function to handle all param changes and reset page
  function onParamsChange(name, value) {
    if (name !== "page" && name !== "limit") {
      params.set("page", "1");
    }

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setParams(params);
  }

  return (
    <div className="ticket-list">
      <div className="filter-bar">
        <div className="filter-item">
          <label>Status</label>
          <select
            value={params.get("status") ?? ""}
            onChange={(e) => onParamsChange("status", e.target.value)}
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
            value={params.get("priority") ?? ""}
            onChange={(e) => onParamsChange("priority", e.target.value)}
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
            value={params.get("department") ?? ""}
            onChange={(e) => onParamsChange("department", e.target.value)}
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
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="loading-tickets" colSpan="7">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading &&
              tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.subject}</td>
                  <td>{t.department}</td>
                  <td className={`priority-${t.priority}`}>{t.priority}</td>
                  <td>
                    <select
                      className={`status-select status-${t.status}`}
                      value={t.status}
                      onChange={(e) =>
                        mutation.mutate({ id: t.id, status: e.target.value })
                      }
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    {t.attachments && t.attachments.length > 0
                      ? t.attachments.map((a, i) => (
                          <div key={i}>
                            <a
                              href={a.url || a.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View {i + 1}
                            </a>
                          </div>
                        ))
                      : "No Attachment"}
                  </td>
                </tr>
              ))}
            {!isLoading && tickets.length === 0 && (
              <tr>
                <td className="no-tickets" colSpan="7">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-container">
          {meta && meta.total > 0 && (
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              totalItems={meta.total}
              itemsPerPage={meta.per_page}
              onParamsChange={onParamsChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
