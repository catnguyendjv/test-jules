import React, { useState, useEffect } from 'react';
import { updateIssue, getCustomFields } from '../services/redmine';

const EditTaskModal = ({ task, statuses, onClose, onTaskUpdate }) => {
  const [formData, setFormData] = useState({
    status_id: task.status.id,
    start_date: task.start_date || '',
    due_date: task.due_date || '',
    done_ratio: task.done_ratio || 0,
    custom_fields: task.custom_fields ? [...task.custom_fields] : [],
  });
  const [customFieldDefs, setCustomFieldDefs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomFieldDefs = async () => {
      const defs = await getCustomFields();
      const issueCustomFields = defs.filter(cf => cf.trackers.some(t => t.id === task.tracker.id));
      setCustomFieldDefs(issueCustomFields);
    };
    fetchCustomFieldDefs();
  }, [task.tracker.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (id, value) => {
    setFormData(prev => {
      const updatedCustomFields = [...prev.custom_fields];
      const fieldIndex = updatedCustomFields.findIndex(cf => cf.id === id);
      if (fieldIndex > -1) {
        updatedCustomFields[fieldIndex] = { ...updatedCustomFields[fieldIndex], value };
      } else {
        updatedCustomFields.push({ id, value });
      }
      return { ...prev, custom_fields: updatedCustomFields };
    });
  };

  const handleSave = async () => {
    try {
      await updateIssue(task.id, formData);
      onTaskUpdate(); // This will close the modal and refresh the board
    } catch (err) {
      setError('Error updating task.');
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task #{task.id}: {task.subject}</h2>
        {error && <p className="error">{error}</p>}
        <form>
          <label>
            Status:
            <select name="status_id" value={formData.status_id} onChange={handleChange}>
              {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>
            Start Date:
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
          </label>
          <label>
            Due Date:
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
          </label>
          <label>
            % Done:
            <input type="range" name="done_ratio" min="0" max="100" step="10" value={formData.done_ratio} onChange={handleChange} />
            <span>{formData.done_ratio}%</span>
          </label>

          {customFieldDefs.map(cf => {
            const fieldValue = formData.custom_fields.find(f => f.id === cf.id)?.value || '';
            return (
              <label key={cf.id}>
                {cf.name}:
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => handleCustomFieldChange(cf.id, e.target.value)}
                />
              </label>
            );
          })}

        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;