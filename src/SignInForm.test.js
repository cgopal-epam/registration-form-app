import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignInForm from './SignInForm';

describe('SignInForm', () => {
  test('renders SignInForm component', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('input email and password and check state update', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('validate email correctness', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  test('validate password length', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    expect(screen.getByText(/Your password must have at least 8 characters/i)).toBeInTheDocument();
  });

  test('submit button should be disabled if form is invalid', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Sign In/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    expect(submitButton).toBeDisabled();
  });

  test('submit button should be enabled if form is valid', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Sign In/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();
  });

  test('handleSignInSubmit is called when form is valid and submit button is clicked', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Sign In/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assuming console.log is mocked to test the submission
    expect(console.log).toHaveBeenCalledWith('Sign In submitted:', { email: 'test@example.com', password: 'password123' });
  });
});