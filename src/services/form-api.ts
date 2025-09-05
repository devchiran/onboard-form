import axios from 'axios';
import type { OnboardFormData } from '../utils/validation';
import { getApiBase } from '../config/apiBase';

export type CorporationValidation = {
  corporationNumber?: string;
  valid: boolean;
  message?: string;
};

export type ProfileSubmissionResponse = {
  message: string;
  success: boolean;
};

const API_BASE = getApiBase();

export async function validateCorporationNumber(
  corporationNumber: string,
  signal?: AbortSignal,
): Promise<CorporationValidation> {
  try {
    const res = await axios.get(
      `${API_BASE}/corporation-number/${corporationNumber}`,
      {
        signal,
      },
    );
    if (res.status !== 200) {
      return { valid: false, message: 'Unable to validate! Please try again.' };
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return error.response.data;
      }
    }
    return {
      corporationNumber: corporationNumber,
      valid: false,
      message: 'Unable to validate! Please try again.',
    };
  }
}

export async function submitProfile(
  payload: OnboardFormData,
): Promise<ProfileSubmissionResponse> {
  try {
    const res = await axios.post(`${API_BASE}/profile-details`, payload);
    return { success: true, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data.message
        : 'Submission failed. Please try again.',
    };
  }
}
