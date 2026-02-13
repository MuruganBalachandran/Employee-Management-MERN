// region imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHistory, FaSearch, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { ActivityLogTable, Pagination, Loader, Filters } from "../../components";
import {
  getActivityLogs,
  removeActivityLog,
  selectActivityLogs,
  selectActivityLogsPagination,
  selectActivityLogsLoading,
  selectActivityLogsTotal, 
} from "../../features";
// endregion

// region component
const ActivityLogs = () => {
  // region hooks
  const dispatch = useDispatch();
  const logs = useSelector(selectActivityLogs);
  const loading = useSelector(selectActivityLogsLoading);
const { page, totalPages } = useSelector(selectActivityLogsPagination);
const totalCount = useSelector(selectActivityLogsTotal);
const hasAnyDataInDB = totalCount > 0;

  // endregion

  // region local state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // endregion

  // region effects
  // fetch logs on page change or search change
  useEffect(() => {
    dispatch(getActivityLogs({ page, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  // debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // endregion

  // region handlers
  const handlePageChange = (newPage) => {
    dispatch(getActivityLogs({ page: newPage, search: debouncedSearch }));
  };

  const handleRefresh = () => {
    dispatch(getActivityLogs({ page, search: debouncedSearch }));
    toast.info("Logs refreshed");
  };

  const handleDeleteLog = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this log?")) return;
      await dispatch(removeActivityLog(id)).unwrap();
      toast.success("Log deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete log");
    }
  };
  // endregion

  // region ui
  return (
    <div className='py-2'>
      {/* Page Header */}
      <div className='mb-4 pb-3 border-bottom'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3'>
          <div>
            <h2 className='fw-bold mb-1 d-flex align-items-center text-dark'>
              <FaHistory className='me-2 text-primary' size={24} />
              Activity Logs
            </h2>
            <p className='text-muted small mb-0'>Monitor system-wide actions and maintain an audit trail.</p>
          </div>
          
          <button 
            className='btn btn-light btn-sm rounded-circle shadow-sm border d-flex align-items-center justify-content-center' 
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh Logs"
          >
            <FaSyncAlt className={loading ? 'fa-spin' : ''} size={14} />
          </button>
        </div>

        <div className='w-100'>
           <Filters 
             search={searchTerm}
             onSearchChange={setSearchTerm}
             placeholder="Search logs by activity, email, or URL..."
           />
        </div>
      </div>

      {/* Main Content */}
      <div className='card border-0 shadow-sm rounded-4 overflow-hidden'>
        <div className='card-body p-0'>
          {loading && !logs.length ? (
            <div className="py-5">
              <Loader text="Loading logs..." />
            </div>
          ) : (
            <ActivityLogTable logs={logs} onDelete={handleDeleteLog} />
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-end mt-4">
         <Pagination 
           page={page} 
           totalPages={totalPages} 
           onPageChange={handlePageChange} 
         />
      </div>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default ActivityLogs;
// endregion
