import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignInForm from './SignInForm';

describe('SignInForm', () => {
  test('renders the sign in form', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('validates email correctly', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
    expect(screen.queryByText(/please enter a valid email address/i)).toBeNull();
  });

  test('validates password length correctly', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    expect(screen.getByText(/your password must have at least 8 characters/i)).toBeInTheDocument();
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    expect(screen.queryByText(/your password must have at least 8 characters/i)).toBeNull();
  });

  test('enables submit button only when form is valid', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    expect(submitButton).not.toBeDisabled();
  });

  test('submits form with valid data', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('Sign In submitted:', {
      email: 'validemail@example.com',
      password: 'longenoughpassword'
    });
    consoleSpy.mockRestore();
  });
});