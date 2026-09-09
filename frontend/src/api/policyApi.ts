import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';
const API_KEY = '123456';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const policyApi = {
  // GET /polizas?tipo=&estado=
  list: (tipo?: string, estado?: string) =>
    apiClient.get('/polizas', { params: { tipo, estado } }),

  // GET /polizas/{id}/riesgos
  getRisks: (id: string) => apiClient.get(`/polizas/${id}/riesgos`),

  // POST /polizas/{id}/renovar
  renew: (id: string, ipc: number) =>
    apiClient.post(`/polizas/${id}/renovar`, { ipc }),

  // POST /polizas/{id}/cancelar
  cancel: (id: string) => apiClient.post(`/polizas/${id}/cancelar`),

  // POST /polizas/{id}/riesgos
  addRisk: (id: string, data: { description: string; amount: number }) =>
    apiClient.post(`/polizas/${id}/riesgos`, data),

  // POST /riesgos/{id}/cancelar
  cancelRisk: (riskId: string) => apiClient.post(`/riesgos/${riskId}/cancelar`),
};