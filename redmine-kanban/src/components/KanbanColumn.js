import React from 'react';

const KanbanColumn = ({ status, statusId, children, onDropInColumn }) => {
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');
    onDropInColumn(issueId, statusId);
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2>{status}</h2>
      <div className="kanban-column-cards">
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;