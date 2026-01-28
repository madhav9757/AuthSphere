import api from "./axios";

const SESSION_BASE = "/sessions";

export const getSessions = async () => {
  const { data } = await api.get(`${SESSION_BASE}/`);
  return data;
};

export const revokeSession = async (sessionId) => {
  const { data } = await api.delete(`${SESSION_BASE}/${sessionId}`);
  return data;
};

export const revokeAllOtherSessions = async () => {
  const { data } = await api.post(`${SESSION_BASE}/revoke-others`);
  return data;
};

export const revokeAllSessions = async () => {
  const { data } = await api.post(`${SESSION_BASE}/revoke-all`);
  return data;
};
