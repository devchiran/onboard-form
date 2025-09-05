import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button.component';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button text="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button text="Styled" className="custom-class" />);
    expect(screen.getByRole('button', { name: 'Styled' })).toHaveClass(
      'custom-class',
    );
  });

  it('renders preChild and postChild', () => {
    render(
      <Button
        text="With Icons"
        preChild={<span>PRE</span>}
        postChild={<span>POST</span>}
      />,
    );
    expect(screen.getByText('PRE')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).toHaveBeenCalled();
  });

  it('sets the correct type', () => {
    render(<Button text="Submit" type="submit" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
