// region imports
import React from "react";
import { FaTrash } from "react-icons/fa";
// endregion

const ActivityLogTable = ({ logs = [], onDelete = () => {}, totalCount = 0, loading = false }) => {

  const getStatusBadgeClass = (status) => {
    if (status >= 200 && status < 300) return "bg-success";
    if (status >= 400) return "bg-danger";
    return "bg-secondary";
  };

  const getMethodBadgeClass = (method) => {
    switch (method?.toUpperCase()) {
      case "GET": return "text-primary border-primary";
      case "POST": return "text-success border-success";
      case "PUT": return "text-warning border-warning";
      case "DELETE": return "text-danger border-danger";
      default: return "text-secondary border-secondary";
    }
  };

  return (
    <div className='table-responsive'>
      <table className='table table-hover align-middle border-top mb-0'>
        <thead className='table-light'>
          <tr>
            <th className='ps-4'>Timestamp</th>
            <th className='px-2'>Method</th>
            <th className='px-2'>Activity</th>
            <th className='px-2'>Email</th>
            <th className='px-2'>URL</th>
            <th className='px-2'>IP Address</th>
            <th className='px-2'>Status</th>
            <th className='pe-4 text-end'>Actions</th>
          </tr>
        </thead>
        <tbody className='border-top-0'>
          {logs.length ? (
            logs.map(log => (
              <tr key={log.Log_Id}>
                <td className='ps-4 small text-muted text-nowrap'>{new Date(log.Created_At).toLocaleString()}</td>
                <td>
                  <span className={`badge border fw-medium ${getMethodBadgeClass(log.Method)} small`}>
                    {log.Method}
                  </span>
                </td>
                <td className='fw-semibold small'>{log.Activity}</td>
                <td className='small text-muted text-nowrap'>{log.Email || "N/A"}</td>
                <td className='text-muted small text-break'>{log.URL}</td>
                <td className='small font-monospace text-muted text-nowrap'>{log.IP || "N/A"}</td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(log.Status)}`}>
                    {log.Status}
                  </span>
                </td>
                <td className='pe-4 text-end'>
                  <button
                    className='btn btn-outline-danger btn-sm border-0 rounded-circle'
                    onClick={() => onDelete(log.Log_Id)}
                    title='Delete Log'
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className='text-center py-4 text-muted'>
                No activity logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogTable;
