import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KanbanBoard from './KanbanBoard';
import * as redmine from '../services/redmine';

// Mock the redmine service
jest.mock('../services/redmine');

const mockIssues = [
  { id: 1, subject: 'Issue 1', status: { id: 1, name: 'New' }, tracker: { id: 1 } },
  { id: 2, subject: 'Issue 2', status: { id: 2, name: 'In Progress' }, tracker: { id: 1 } },
];

const mockStatuses = [
  { id: 1, name: 'New' },
  { id: 2, name: 'In Progress' },
];

describe('KanbanBoard', () => {
  beforeEach(() => {
    redmine.getAssignedIssues.mockResolvedValue(mockIssues);
    redmine.getIssueStatuses.mockResolvedValue(mockStatuses);
    redmine.getCustomFields.mockResolvedValue([]);
  });

  it('fetches data and renders columns and cards', async () => {
    render(<KanbanBoard />);

    // Wait for the data to be loaded and rendered
    expect(await screen.findByText('Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Issue 2')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('opens the edit modal when a card is clicked', async () => {
    render(<KanbanBoard />);

    // Wait for cards to appear
    const card1 = await screen.findByText('Issue 1');
    fireEvent.click(card1);

    // Check if modal opens with the correct task
    expect(await screen.findByText('Edit Task #1: Issue 1')).toBeInTheDocument();
  });

  it('updates task status on drop', async () => {
    render(<KanbanBoard />);
    await screen.findByText('Issue 1');

    const card = screen.getByText('Issue 1');
    const dropColumn = screen.getByText('In Progress').closest('.kanban-column');

    // Simulate drag and drop
    fireEvent.dragStart(card, { dataTransfer: { setData: () => {} } });
    fireEvent.drop(dropColumn, { dataTransfer: { getData: () => '1' } });

    await waitFor(() => {
      expect(redmine.updateIssue).toHaveBeenCalledWith('1', { status_id: 2 });
    });
  });
});