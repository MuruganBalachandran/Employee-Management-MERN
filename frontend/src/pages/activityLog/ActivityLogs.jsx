// region imports
// react
import React, { useEffect, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";

// icons
import { FaHistory, FaSyncAlt } from "react-icons/fa";

// notifications
import { toast } from "react-toastify";

// components
import {
  ActivityLogTable,
  Pagination,
  Loader,
  Filters,
  ConfirmModal,
} from "../../components";

// redux features
import {
  getActivityLogs,
  removeActivityLog,
  selectActivityLogs,
  selectActivityLogsPagination,
  selectActivityLogsLoading,
  selectActivityLogsTotal,
   selectActivityLogsOverallTotal,
} from "../../features";
// endregion

// region component
const ActivityLogs = () => {
  // region redux hooks
  const dispatch = useDispatch();

  const logs = useSelector(selectActivityLogs) || [];
  const loading = useSelector(selectActivityLogsLoading) || false;
  const pagination = useSelector(selectActivityLogsPagination) || {};
  const totalCount = useSelector(selectActivityLogsTotal) || 0;
const overallTotal = useSelector(selectActivityLogsOverallTotal) || 0;
  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  // endregion

  // region local state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  // endregion

  // region effects
  useEffect(() => {
    dispatch(
      getActivityLogs({
        page: page || 1,
        search: debouncedSearch || "",
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  // endregion

  // region handlers
  const handlePageChange = (newPage = 1) => {
    dispatch(
      getActivityLogs({
        page: newPage || 1,
        search: debouncedSearch || "",
      }),
    );
  };

  const handleRefresh = () => {
    dispatch(
      getActivityLogs({
        page: page || 1,
        search: debouncedSearch || "",
      }),
    );

    toast?.info?.("Logs refreshed");
  };

  // open delete modal
  const handleDeleteLog = (id = "") => {
    setLogToDelete(id || "");
    setShowDeleteModal(true);
  };

  // confirm delete
  const confirmDeleteLog = async () => {
    if (!logToDelete) return;

    try {
      await dispatch(removeActivityLog(logToDelete))?.unwrap?.();
      toast?.success?.("Log deleted successfully");
    } catch (err) {
      toast?.error?.(err || "Failed to delete log");
    } finally {
      setLogToDelete(null);
      setShowDeleteModal(false);
    }
  };
  // endregion

  // region ui
  return (
    <div className='py-2'>
      {/* page header */}
      <div className='mb-4 pb-3 border-bottom'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3'>
          <div>
            <h2 className='fw-bold mb-1 d-flex align-items-center text-dark'>
              <FaHistory className='me-2 text-primary' size={24} />
              Activity Logs
            </h2>

            <p className='text-muted small mb-0'>
              Monitor system-wide actions and maintain an audit trail.
            </p>
          </div>
  {overallTotal > 0 && (
          <button
            className='btn btn-light btn-sm rounded-circle shadow-sm border d-flex align-items-center justify-content-center'
            onClick={handleRefresh}
            disabled={loading}
            title='Refresh Logs'
          >
            <FaSyncAlt className={loading ? "fa-spin" : ""} size={14} />
          </button>
  )}

        </div>

    {overallTotal > 0 && (
  <div className='w-100'>
    <Filters
      search={searchTerm || ""}
      onSearchChange={setSearchTerm}
      placeholder='Search logs by activity, email, or URL...'
    />
  </div>
)}

      </div>

      {/* main content */}
      <div className='card border-0 shadow-sm rounded-4 overflow-hidden'>
        <div className='card-body p-0'>
          {loading && !logs?.length && (
            <div className='py-5'>
              <Loader text='Loading logs...' />
            </div>
          )}

    {!loading && overallTotal > 0 && (
  <ActivityLogTable
    logs={logs || []}
    onDelete={handleDeleteLog}
  />
)}

{!loading && overallTotal === 0 && (
  <div className='text-center py-5 text-muted'>
    No activity logs available.
  </div>
)}

        </div>
      </div>

      {/* pagination */}
 {overallTotal > 0 && (
  <div className='d-flex justify-content-end mt-4'>
    <Pagination
      page={page || 1}
      totalPages={totalPages || 1}
      onPageChange={handlePageChange}
    />
  </div>
)}


      {/* delete modal */}
      <ConfirmModal
        show={showDeleteModal}
        onConfirm={confirmDeleteLog}
        onClose={() => {
          setShowDeleteModal(false);
          setLogToDelete(null);
        }}
        title='Delete Activity Log'
        message='Are you sure you want to delete this activity log?'
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default ActivityLogs;
// endregion
