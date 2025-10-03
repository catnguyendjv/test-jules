import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanCard from './KanbanCard';

describe('KanbanCard', () => {
  const mockTask = {
    id: 1,
    subject: 'Test Task Subject',
  };

  it('renders task details correctly', () => {
    render(<KanbanCard task={mockTask} />);
    expect(screen.getByText('Test Task Subject')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('calls onCardClick when clicked', () => {
    const handleClick = jest.fn();
    render(<KanbanCard task={mockTask} onCardClick={handleClick} />);
    fireEvent.click(screen.getByText('Test Task Subject'));
    expect(handleClick).toHaveBeenCalledWith(mockTask);
  });
});