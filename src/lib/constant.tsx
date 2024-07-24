import VehicleAccessIcon from "@/components/Icon/VehicleAccessIcon";
import CameraIcon from "@/components/Icon/CameraIcon";
import GateIcon from "@/components/Icon/GateIcon";
import LogIcon from "@/components/Icon/LogIcon";

export const dashboardItems = [
  {
    name: "Dashboard",
    route: "/",
    icon: <VehicleAccessIcon/>
  },
  {
    name: "Camera",
    route: "/camera",
    icon: <CameraIcon/>
  },
  {
    name: "Gate",
    route: "/gate",
    icon: <GateIcon/>
  },
  {
    name: "Vehicle Access Log",
    route: "/vehiclelog",
    icon: <LogIcon/>
  }
];

export const tabs = {
  DASHBOARD: "Dashboard",
  CAMERA: "Camera",
  GATE: "Gate"
};
