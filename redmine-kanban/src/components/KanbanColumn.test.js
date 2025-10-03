import React from 'react';
import { render, screen } from '@testing-library/react';
import KanbanColumn from './KanbanColumn';

describe('KanbanColumn', () => {
  it('renders the status title and children', () => {
    render(
      <KanbanColumn status="In Progress">
        <div>Child Component</div>
      </KanbanColumn>
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});