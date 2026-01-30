import api from "./axios";

export const getGlobalLogs = async () => {
    try {
        const { data } = await api.get("/audit-logs/global");
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getProjectLogs = async (projectId) => {
    try {
        const { data } = await api.get(`/audit-logs/project/${projectId}`);
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
