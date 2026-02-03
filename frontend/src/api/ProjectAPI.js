import api from "./axios";

/**
 * Base endpoint for project-related operations
 */
const PROJECTS_URL = "/projects";

/* ------------------- GET ALL PROJECTS ------------------- */
export const getProjects = async () => {
  try {
    const { data } = await api.get(PROJECTS_URL);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- GET SINGLE PROJECT ------------------- */
export const getProject = async (projectId) => {
  try {
    const { data } = await api.get(`${PROJECTS_URL}/${projectId}`);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- CREATE PROJECT ------------------- */
export const createProject = async (payload) => {
  try {
    const { data } = await api.post(PROJECTS_URL, payload);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- UPDATE PROJECT ------------------- */
export const updateProject = async (projectId, payload) => {
  try {
    const { data } = await api.patch(`${PROJECTS_URL}/${projectId}`, payload);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- ROTATE PROJECT KEYS ------------------- */
export const rotateProjectKeys = async (projectId) => {
  try {
    const { data } = await api.post(`${PROJECTS_URL}/${projectId}/rotate-keys`);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- GET PROJECT USERS ------------------- */
export const getProjectUsers = async (projectId) => {
  try {
    const { data } = await api.get(`${PROJECTS_URL}/${projectId}/users`);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- GET CONFIGURED PROVIDERS ------------------- */
export const getConfiguredProviders = async (projectId) => {
  try {
    const { data } = await api.get(
      `${PROJECTS_URL}/${projectId}/providers-config`,
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- DELETE PROJECT USER ------------------- */
export const deleteProjectUser = async (projectId, userId) => {
  try {
    const { data } = await api.delete(
      `${PROJECTS_URL}/${projectId}/users/${userId}`,
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- TOGGLE USER VERIFICATION ------------------- */
export const toggleUserVerification = async (projectId, userId) => {
  try {
    const { data } = await api.patch(
      `${PROJECTS_URL}/${projectId}/users/${userId}/verify`,
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- DELETE PROJECT ------------------- */
export const deleteProject = async (projectId) => {
  try {
    const { data } = await api.delete(`${PROJECTS_URL}/${projectId}`);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ------------------- SEND TEST EMAIL ------------------- */
export const sendTestEmail = async (projectId, email) => {
  try {
    const { data } = await api.post(
      `${PROJECTS_URL}/${projectId}/send-test-email`,
      { email },
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ========================================================
   Error Normalization Helper
======================================================== */
const normalizeError = (error) => {
  if (error?.response?.data) {
    return new Error(error.response.data.message || "Request failed");
  }

  if (error?.message) {
    return new Error(error.message);
  }

  return new Error("An unexpected error occurred");
};
