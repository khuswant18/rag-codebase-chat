import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error) {

  if (typeof error === 'string') {
    return error;
  }


  if (error?.response?.data) {
    const { data } = error.response;


    if (data?.message) {

      const message = data.message.toLowerCase();


      if (message.includes('internal server error') ||
          message.includes('stack trace') ||
          message.includes('sql') ||
          message.includes('database')) {
        return 'Something went wrong. Please try again later.';
      }

      // Handle specific validation messages
      if (message.includes('college') && message.includes('email')) {
        return 'You must use a valid college email address to sign up. Please use your .edu or institutional email.';
      }

      if (message.includes('student') && message.includes('email')) {
        return 'Only current college students can sign up. Please use your college email address.';
      }

      if (message.includes('university') || message.includes('institution')) {
        return 'Please use your official college or university email address.';
      }

      return data.message;
    }


    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors[0]?.message || 'Please check your input and try again.';
    }
  }


  if (error?.code === 'NETWORK_ERROR' || !error?.response) {
    return 'Network error. Please check your connection and try again.';
  }


  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }


  return 'Something went wrong. Please try again.';
}
