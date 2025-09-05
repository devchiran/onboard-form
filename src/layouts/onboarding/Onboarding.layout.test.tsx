import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import OnboardingLayout from './Onboarding.layout';
import * as constants from '../../config/constants';

jest.mock('../../components/onboardForm/OnboardForm.component', () => () => (
  <div>Mocked OnboardForm</div>
));

describe('OnboardingLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the step header with correct total steps', () => {
    const original = constants.TOTAL_STEPS;
    // @ts-ignore
    constants.TOTAL_STEPS = 5;
    render(<OnboardingLayout />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    // @ts-ignore
    constants.TOTAL_STEPS = original;
  });

  it('renders the OnboardForm component', () => {
    render(<OnboardingLayout />);
    expect(screen.getByText('Mocked OnboardForm')).toBeInTheDocument();
  });

  it('has the correct layout classes', () => {
    const { container } = render(<OnboardingLayout />);
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'gap-20',
      'justify-center',
      'align-center',
      'min-h-screen',
    );
  });
});
