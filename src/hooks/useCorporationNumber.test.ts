import { renderHook, act } from '@testing-library/react';
import { useCorporationNumber } from './useCorporationNumber';
import * as formApi from '../services/form-api';
import { CORPORATION_NUMBER_LENGTH } from '../config/constants';

jest.mock('../config/apiBase', () => ({
  getApiBase: () => 'http://localhost:3000',
}));

jest.mock('../services/form-api');

const mockValidateCorporationNumber =
  formApi.validateCorporationNumber as jest.Mock;

describe('useCorporationNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns invalid if value is empty', async () => {
    const { result } = renderHook(() => useCorporationNumber());
    let response;
    await act(async () => {
      response = await result.current.checkCorporationNumber('');
    });
    expect(response).toEqual({
      valid: false,
      message: `Corporation number must be exactly ${CORPORATION_NUMBER_LENGTH} characters`,
    });
  });

  it('returns invalid if value is not correct length', async () => {
    const { result } = renderHook(() => useCorporationNumber());
    let response;
    await act(async () => {
      response = await result.current.checkCorporationNumber('123');
    });
    expect(response).toEqual({
      valid: false,
      message: `Corporation number must be exactly ${CORPORATION_NUMBER_LENGTH} characters`,
    });
  });

  it('calls validateCorporationNumber and returns API result for valid input', async () => {
    mockValidateCorporationNumber.mockResolvedValue({
      valid: true,
      message: 'ok',
    });
    const { result } = renderHook(() => useCorporationNumber());
    let response;
    await act(async () => {
      response = await result.current.checkCorporationNumber('123456789');
    });
    expect(mockValidateCorporationNumber).toHaveBeenCalledWith(
      '123456789',
      expect.any(AbortSignal),
    );
    expect(response).toEqual({ valid: true, message: 'ok' });
  });

  it('sets loading true while validating and false after', async () => {
    let resolvePromise: (value: any) => void;
    mockValidateCorporationNumber.mockImplementation(
      () =>
        new Promise((res) => {
          resolvePromise = res;
        }),
    );
    const { result } = renderHook(() => useCorporationNumber());
    act(() => {
      result.current.checkCorporationNumber('123456789');
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
      resolvePromise({ valid: true });
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(false);
  });

  it('aborts previous request if called again quickly', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    mockValidateCorporationNumber.mockResolvedValue({ valid: true });
    const { result } = renderHook(() => useCorporationNumber());
    await act(async () => {
      result.current.checkCorporationNumber('123456789');
      result.current.checkCorporationNumber('987654321');
    });
    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
