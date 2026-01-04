import api from "./axios";

/**
 * Base endpoint for projects
 * (relative to axios baseURL)
 */
const PROJECTS_URL = "/projects";

/* ------------------- GET ALL PROJECTS ------------------- */
export const getProjects = async () => {
  const { data } = await api.get(PROJECTS_URL);
  return data;
};

/* ------------------- GET SINGLE PROJECT ------------------- */
export const getProject = async (projectId) => {
  const { data } = await api.get(`${PROJECTS_URL}/${projectId}`);
  return data;
};

/* ------------------- CREATE PROJECT ------------------- */
export const createProject = async (payload) => {
  const { data } = await api.post(PROJECTS_URL, payload);
  return data;
};

/* ------------------- UPDATE PROJECT (PARTIAL) ------------------- */
export const updateProject = async (projectId, payload) => {
  const { data } = await api.patch(
    `${PROJECTS_URL}/${projectId}`,
    payload
  );
  return data;
};

/* ------------------- DELETE PROJECT ------------------- */
export const deleteProject = async (projectId) => {
  const { data } = await api.delete(
    `${PROJECTS_URL}/${projectId}`
  );
  return data;
};
