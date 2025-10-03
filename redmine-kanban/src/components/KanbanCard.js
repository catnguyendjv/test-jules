import React from 'react';

const KanbanCard = ({ task, onCardClick }) => {
  const handleClick = () => {
    onCardClick(task);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('issueId', task.id);
  };

  return (
    <div
      className="kanban-card"
      onClick={handleClick}
      onDragStart={handleDragStart}
      draggable="true"
    >
      <h4>{task.subject}</h4>
      <p>#{task.id}</p>
    </div>
  );
};

export default KanbanCard;