import axios from 'axios';

let redmineApi;

export const initApi = (baseURL, apiKey) => {
  redmineApi = axios.create({
    baseURL,
    headers: {
      'X-Redmine-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });
};

export const getAssignedIssues = async () => {
  try {
    const response = await redmineApi.get('/issues.json', {
      params: {
        assigned_to_id: 'me',
        status_id: '*',
      },
    });
    return response.data.issues;
  } catch (error) {
    console.error('Error fetching issues from Redmine:', error);
    throw error;
  }
};

export const getCustomFields = async () => {
  try {
    const response = await redmineApi.get('/custom_fields.json');
    return response.data.custom_fields;
  } catch (error) {
    console.error('Error fetching custom fields from Redmine:', error);
    return [];
  }
};

export const updateIssue = async (id, issueData) => {
  try {
    await redmineApi.put(`/issues/${id}.json`, {
      issue: issueData,
    });
  } catch (error) {
    console.error('Error updating issue in Redmine:', error);
    throw error;
  }
};

export const getIssueStatuses = async () => {
  try {
    const response = await redmineApi.get('/issue_statuses.json');
    return response.data.issue_statuses;
  } catch (error) {
    console.error('Error fetching issue statuses from Redmine:', error);
    throw error;
  }
};