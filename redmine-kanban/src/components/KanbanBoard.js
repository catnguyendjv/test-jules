import React, { useState, useEffect, useCallback } from 'react';
import { getAssignedIssues, getIssueStatuses, updateIssue } from '../services/redmine';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import EditTaskModal from './EditTaskModal';
import './Kanban.css';

const KanbanBoard = () => {
  const [issues, setIssues] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [assignedIssues, issueStatuses] = await Promise.all([
        getAssignedIssues(),
        getIssueStatuses(),
      ]);
      setIssues(assignedIssues);
      setStatuses(issueStatuses);
    } catch (err) {
      setError('Error fetching data from Redmine. Please check your settings.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCardClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = () => {
    handleCloseModal();
    fetchData();
  };

  const handleDropInColumn = async (issueId, newStatusId) => {
    const issueToUpdate = issues.find(issue => issue.id.toString() === issueId);
    if (issueToUpdate && issueToUpdate.status.id !== newStatusId) {
      try {
        await updateIssue(issueId, { status_id: newStatusId });
        fetchData(); // Refetch data to reflect the change
      } catch (err) {
        setError('Error updating task status.');
        console.error(err);
      }
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <div className="kanban-board">
        {statuses.map(status => (
          <KanbanColumn
            key={status.id}
            status={status.name}
            statusId={status.id}
            onDropInColumn={handleDropInColumn}
          >
            {issues
              .filter(issue => issue.status.id === status.id)
              .map(issue => (
                <KanbanCard key={issue.id} task={issue} onCardClick={handleCardClick} />
              ))}
          </KanbanColumn>
        ))}
      </div>
      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          statuses={statuses}
          onClose={handleCloseModal}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default KanbanBoard;