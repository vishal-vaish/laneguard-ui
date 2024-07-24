import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {StatusType} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const statusIndicator = (status: StatusType) => {
  const getColor = (): string => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  return getColor();
}

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
