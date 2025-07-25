import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const getVideoList = () => api.get('/video').then(res => res.data.list);
export const getAccessList = () => api.get('/access').then(res => res.data.list);
export const getParkingList = () => api.get('/parking').then(res => res.data.list);
export const getVisitorList = () => api.get('/visitor').then(res => res.data.list);
export const getEnergyList = () => api.get('/energy').then(res => res.data.list);
export const getMaintenanceList = () => api.get('/maintenance').then(res => res.data.list);
export const getFireList = () => api.get('/fire').then(res => res.data.list);
export const getOfficeList = () => api.get('/office').then(res => res.data.list); 