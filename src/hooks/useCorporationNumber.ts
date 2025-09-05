import { useCallback, useEffect, useRef, useState } from 'react';
import {
  validateCorporationNumber,
  type CorporationValidation,
} from '../services/form-api';
import { CORPORATION_NUMBER_LENGTH } from '../config/constants';

/**
 * Custom hook to validate corporation number via API on-demand.
 * Debounces overlapping calls via AbortController and keeps last result.
 */
export function useCorporationNumber() {
  const [loading, setLoading] = useState(false);

  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  // const check = useCallback(async (value: string): Promise<string | true> => {
  const checkCorporationNumber = useCallback(
    async (value: string): Promise<CorporationValidation> => {
      if (!value || value.length !== CORPORATION_NUMBER_LENGTH) {
        return {
          valid: false,
          message: `Corporation number must be exactly ${CORPORATION_NUMBER_LENGTH} characters`,
        };
      }

      controller.current?.abort();
      controller.current = new AbortController();

      setLoading(true);
      const res = await validateCorporationNumber(
        value,
        controller.current.signal,
      );
      setLoading(false);
      return res;
    },
    [],
  );
  return { loading, checkCorporationNumber };
}
