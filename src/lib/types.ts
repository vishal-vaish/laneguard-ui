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

export interface CreateGateDataType {
  id: null;
  name: string;
  entryCameraId: string;
  exitCameraId: string;
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
  entryDetectionImagePath:string;
  entryLicensePlateImagePath:string;
  exitDetectionImagePath:string;
  exitLicensePlateImagePath:string;
  vehicleType: VehicleType;
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
  entryDetectionImagePath:string;
  entryLicensePlateImagePath:string;
  exitDetectionImagePath:string;
  exitLicensePlateImagePath:string;
  vehicleType: VehicleType;
}

export enum AlertType {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export enum VehicleType {
  UNKNOWN = "Unknown",
  OTHER_VEHICLE = "Other vehicle",
  SMALL_SIZED_VEHICLE = "Small-sized vehicle",
  LARGE_SIZED_VEHICLE = "Large-sized vehicle",
  PEDESTRIAN_TRIGGER = "Pedestrian trigger",
  TWO_WHEELER_TRIGGER = "Two-wheeler trigger",
  TRICYCLE = "Tricycle"
}