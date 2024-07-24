export interface CameraDataType {
  id: string | null;
  ipAddress: string;
  macAddress: string;
  type: string;
}

export interface GateDataType {
  id: null;
  name: string;
  entryCameraId: string;
  exitCameraId: string;
  entryCameraIpAddress: string;
  exitCameraIpAddress: string;
}
export type StatusType = 'IN_PROGRESS' | 'COMPLETED';

export interface VehicleAccessLog {
  id: string;
  licensePlate: string;
  entryTime: string;
  exitTime:string;
  entryGate: GateDataType;
  exitGate: GateDataType;
  entryCamera: CameraDataType;
  exitCamera: CameraDataType;
  status: StatusType;
}

export interface VehicleMonitorLog {
  id: string;
  licensePlate: string;
  entryTime: string;
  exitTime:string;
  entryGateName: string;
  exitGateName: string;
  entryCameraIpAddress: string;
  exitCameraIpAddress: string;
  status: StatusType;
}

export enum AlertType {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}
