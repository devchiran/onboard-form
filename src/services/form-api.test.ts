import { validateCorporationNumber, submitProfile } from './form-api';
import axios from 'axios';

jest.mock('axios');
jest.mock('../config/apiBase', () => ({
  getApiBase: () => 'http://localhost:3000',
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('form-api', () => {
  describe('validateCorporationNumber', () => {
    it('returns data when API call is successful and status 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { valid: true, message: 'ok' },
      });
      const result = await validateCorporationNumber('123456789');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/corporation-number/123456789',
        { signal: undefined },
      );
      expect(result).toEqual({ valid: true, message: 'ok' });
    });

    it('returns error message if status is not 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 500 });
      const result = await validateCorporationNumber('123456789');
      expect(result).toEqual({
        valid: false,
        message: 'Unable to validate! Please try again.',
      });
    });

    it('returns default error for 404 from API', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404, data: { valid: false, message: 'Not found' } },
      });
      const result = await validateCorporationNumber('123456789');
      expect(result).toEqual({
        corporationNumber: '123456789',
        valid: false,
        message: 'Unable to validate! Please try again.',
      });
    });

    it('returns default error for other errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      const result = await validateCorporationNumber('123456789');
      expect(result).toEqual({
        corporationNumber: '123456789',
        valid: false,
        message: 'Unable to validate! Please try again.',
      });
    });
  });

  describe('submitProfile', () => {
    it('returns success true and message on successful post', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: 'Profile saved' },
      });
      const result = await submitProfile({} as any);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/profile-details',
        {},
      );
      expect(result).toEqual({ success: true, message: 'Profile saved' });
    });

    it('returns default error message on API failure', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { message: 'Failed' } },
      });
      const result = await submitProfile({} as any);
      expect(result).toEqual({
        success: false,
        message: 'Submission failed. Please try again.',
      });
    });

    it('returns default error message on generic error', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
      const result = await submitProfile({} as any);
      expect(result).toEqual({
        success: false,
        message: 'Submission failed. Please try again.',
      });
    });
  });
});
