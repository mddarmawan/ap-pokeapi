import { ErrorResponse } from "./types";

export const handleError = (error: unknown): ErrorResponse => {
  return {
    success: false,
    message: error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error.',
  };
}

export const checkDateDiff = (date1: Date, date2: Date): number => {
  const diff = date1.getTime() - date2.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
}
