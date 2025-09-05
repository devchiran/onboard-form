import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from './FormInput.component';

const mockRegister = (id: string) => ({
  name: id,
  onBlur: jest.fn(),
  ref: jest.fn(),
});

describe('FormInput', () => {
  it('renders label and input', () => {
    render(
      <FormInput label="First Name" id="firstName" register={mockRegister} />,
    );
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(
      <FormInput
        label="Last Name"
        id="lastName"
        register={mockRegister}
        error="Invalid last name"
      />,
    );
    expect(screen.getByText('Invalid last name')).toBeInTheDocument();
  });

  it('calls onBlur prop and register onBlur when input is blurred', () => {
    const onBlur = jest.fn();
    const register = (id: string) => ({
      name: id,
      onBlur: jest.fn(),
      ref: jest.fn(),
    });
    render(
      <FormInput
        label="Phone"
        id="phone"
        register={register}
        onBlur={onBlur}
      />,
    );
    const input = screen.getByLabelText('Phone');
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });

  it('shows loading indicator when loading is true', () => {
    render(
      <FormInput
        label="Corporation Number"
        id="corporationNumber"
        register={mockRegister}
        loading={true}
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies required attribute when required is true', () => {
    render(
      <FormInput
        label="Last Name"
        id="lastName"
        register={mockRegister}
        required
      />,
    );
    expect(screen.getByLabelText('Last Name')).toBeRequired();
  });
});
