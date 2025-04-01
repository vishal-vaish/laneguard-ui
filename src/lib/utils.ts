import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {StatusType, VehicleType} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const statusIndicator = (status: StatusType) => {
  const getColor = () => {
    switch (status) {
      case 'IN_PROGRESS':
        return {backgroundColor: "bg-blue-100", text: "text-blue-800"}
      case 'COMPLETED':
        return {backgroundColor: "bg-green-100", text: "text-green-800"}
    }
  };
  return getColor();
}

const vehicleTypeColors = {
  [VehicleType.UNKNOWN]: "gray",
  [VehicleType.OTHER_VEHICLE]: "purple",
  [VehicleType.SMALL_SIZED_VEHICLE]: "green",
  [VehicleType.LARGE_SIZED_VEHICLE]: "blue",
  [VehicleType.PEDESTRIAN_TRIGGER]: "yellow",
  [VehicleType.TWO_WHEELER_TRIGGER]: "orange",
  [VehicleType.TRICYCLE]: "indigo"
};

const formatVehicleTypeLabel = (type: VehicleType) => {
  return type
    .replace(/vehicle|trigger/gi, "")
    .replace(/-/g, " ")
    .trim();
};

export const getVehicleTypeBadgeStyle = (type:VehicleType) => {
  const color = vehicleTypeColors[type] || "gray";
  return {
    backgroundColor: `bg-${color}-100`,
    textColor: `text-${color}-800`,
    borderColor: `border-${color}-200`,
    label: formatVehicleTypeLabel(type)
  };
};

export const formatDateTime = (dateString: string | undefined) => {
  if (dateString) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  }
  return;
};

export const formatDate = (date:string) => {
  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const formatTime = (date:string) => {
  const dateFormatted = new Date(date);

  return dateFormatted.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}