import '@testing-library/jest-dom';

jest.mock('../../config/apiBase', () => ({
  getApiBase: () => 'http://localhost:3000',
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardForm from './OnboardForm.component';
import * as formApi from '../../services/form-api';
import * as useCorporationNumberHook from '../../hooks/useCorporationNumber';

jest.mock('../../services/form-api');
jest.mock('../../hooks/useCorporationNumber');

describe('OnboardForm', () => {
  const mockCheckCorporationNumber = jest.fn();
  const mockSubmitProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (
      useCorporationNumberHook.useCorporationNumber as jest.Mock
    ).mockReturnValue({
      loading: false,
      checkCorporationNumber: mockCheckCorporationNumber,
    });
    (formApi.submitProfile as jest.Mock).mockImplementation(mockSubmitProfile);
  });

  it('renders all form fields', () => {
    render(<OnboardForm />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Corporation Number')).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(<OnboardForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText('First name must be at least 2 characters'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Last name must be at least 2 characters'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Phone number must be a valid Canadian number, start with +1, and contain 10 digits after the country code.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Corporation number must be exactly 9 characters'),
      ).toBeInTheDocument();
    });
  });

  it('calls checkCorporationNumber on blur', async () => {
    mockCheckCorporationNumber.mockResolvedValue({
      valid: false,
      message: 'Invalid corporation number',
    });
    render(<OnboardForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+11234567890' },
    });
    const corpInput = screen.getByLabelText('Corporation Number');
    fireEvent.change(corpInput, { target: { value: '123456789' } });
    fireEvent.blur(corpInput);
    await waitFor(() => {
      expect(mockCheckCorporationNumber).toHaveBeenCalledWith('123456789');
    });
  });

  it('submits form and shows success message', async () => {
    mockCheckCorporationNumber.mockResolvedValue({ valid: true });
    mockSubmitProfile.mockResolvedValue({ success: true });
    render(<OnboardForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+11234567890' },
    });
    fireEvent.change(screen.getByLabelText('Corporation Number'), {
      target: { value: '123456789' },
    });
    fireEvent.blur(screen.getByLabelText('Corporation Number'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmitProfile).toHaveBeenCalled();
      expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failed submit', async () => {
    mockCheckCorporationNumber.mockResolvedValue({ valid: true });
    mockSubmitProfile.mockResolvedValue({ success: false, message: 'Failed' });
    render(<OnboardForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+11234567890' },
    });
    fireEvent.change(screen.getByLabelText('Corporation Number'), {
      target: { value: '123456789' },
    });
    fireEvent.blur(screen.getByLabelText('Corporation Number'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmitProfile).toHaveBeenCalled();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  it('can go back to form after successful submit', async () => {
    mockCheckCorporationNumber.mockResolvedValue({ valid: true });
    mockSubmitProfile.mockResolvedValue({ success: true });
    render(<OnboardForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+11234567890' },
    });
    fireEvent.change(screen.getByLabelText('Corporation Number'), {
      target: { value: '123456789' },
    });
    fireEvent.blur(screen.getByLabelText('Corporation Number'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  });
});
