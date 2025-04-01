import axios from "axios";
import {CameraDataType, CreateGateDataType, GateDataType} from "@/lib/types";

const baseUrl = "http://localhost:8888/api"
export const WEBSOCKET_URL = 'ws://localhost:8888/lane-guard';
export const ALERT_TOPIC = '/topic/alerts';
export const MONITOR_TOPIC = '/topic/monitor';

export const getAllCamera = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${baseUrl}/cameras`);
    return response.data;
  } catch (error) {
    console.error('Error fetching camera data:', error);
    throw error;
  }
};

export const createCamera = async (cameraData:CameraDataType): Promise<any[]> => {
  try {
    const response = await axios.post(`${baseUrl}/cameras`,cameraData);
    return response.data;
  } catch (error) {
    console.error('Error creating camera data:', error);
    throw error;
  }
};

export const updateCamera = async (cameraData:CameraDataType): Promise<any[]> => {
  try {
    const response = await axios.put(`${baseUrl}/cameras/${cameraData.id}`,cameraData);
    return response.data;
  } catch (error) {
    console.error('Error updating camera data:', error);
    throw error;
  }
};

export const getAllGates = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${baseUrl}/gates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gate data:', error);
    throw error;
  }
};

export const getAllAvailableEntryCameras = async (isAvailable:boolean): Promise<any[]> => {
  try {
    const response = await axios.get(`${baseUrl}/cameras/filter?type=ENTRY${isAvailable ? "&available=true" : ""}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gate data:', error);
    throw error;
  }
};

export const getAllAvailableExitCameras = async (isAvailable:boolean): Promise<any[]> => {
  try {
    const response = await axios.get(`${baseUrl}/cameras/filter?type=EXIT${isAvailable ? "&available=true" : ""}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gate data:', error);
    throw error;
  }
};

export const createGate = async (gateData:CreateGateDataType): Promise<any[]> => {
  try {
    const response = await axios.post(`${baseUrl}/gates`,gateData);
    return response.data;
  } catch (error) {
    console.error('Error creating camera data:', error);
    throw error;
  }
};

export const updateGate = async (gateData:CreateGateDataType): Promise<any[]> => {
  try {
    const response = await axios.put(`${baseUrl}/gates/${gateData.id}`,gateData);
    return response.data;
  } catch (error) {
    console.error('Error creating camera data:', error);
    throw error;
  }
};

export const getAllVehicleAccess = async (
  filterType?:string,
  filterValue?:string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${baseUrl}/logs${filterType ? `?${filterType}=${filterValue}` : ""}`

    );
    return response.data.content;
  } catch (error) {
    console.error('Error fetching gate data:', error);
    throw error;
  }
};

export const getActiveVehicleAccess = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${baseUrl}/logs/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gate data:', error);
    throw error;
  }
};
