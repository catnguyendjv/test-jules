import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTaskModal from './EditTaskModal';
import * as redmine from '../services/redmine';

jest.mock('../services/redmine');

const mockTask = {
  id: 1,
  subject: 'Test Task',
  status: { id: 1, name: 'New' },
  tracker: { id: 1 },
  start_date: '2023-01-01',
  due_date: '2023-01-10',
  done_ratio: 20,
  custom_fields: [],
};

const mockStatuses = [
  { id: 1, name: 'New' },
  { id: 2, name: 'In Progress' },
];

describe('EditTaskModal', () => {
  beforeEach(() => {
    redmine.getCustomFields.mockResolvedValue([]);
    redmine.updateIssue.mockResolvedValue({});
  });

  it('renders the form with initial task data', () => {
    render(
      <EditTaskModal
        task={mockTask}
        statuses={mockStatuses}
        onClose={() => {}}
        onTaskUpdate={() => {}}
      />
    );

    expect(screen.getByLabelText('Status:').value).toBe('1');
    expect(screen.getByLabelText('Start Date:').value).toBe('2023-01-01');
    expect(screen.getByLabelText('Due Date:').value).toBe('2023-01-10');
    expect(screen.getByLabelText('% Done:').value).toBe('20');
  });

  it('calls updateIssue and onTaskUpdate on save', async () => {
    const handleTaskUpdate = jest.fn();
    render(
      <EditTaskModal
        task={mockTask}
        statuses={mockStatuses}
        onClose={() => {}}
        onTaskUpdate={handleTaskUpdate}
      />
    );

    // Change a value
    fireEvent.change(screen.getByLabelText('Status:'), { target: { value: '2' } });

    // Save the form
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(redmine.updateIssue).toHaveBeenCalledWith(1, expect.objectContaining({
        status_id: '2',
      }));
    });

    expect(handleTaskUpdate).toHaveBeenCalled();
  });
});