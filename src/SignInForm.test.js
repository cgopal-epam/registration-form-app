import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignInForm from './SignInForm';

describe('SignInForm', () => {
  test('renders correctly', () => {
    const { container } = render(<SignInForm />);
    expect(container).toMatchSnapshot();
  });

  test('email input should update state', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('password input should update state', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('valid email should set isEmailValid to true', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'valid@example.com', name: 'email' } });
    const emailValidationMessage = screen.queryByText(/please enter a valid email address/i);
    expect(emailValidationMessage).not.toBeInTheDocument();
  });

  test('invalid email should set isEmailValid to false and show message', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail', name: 'email' } });
    const emailValidationMessage = screen.getByText(/please enter a valid email address/i);
    expect(emailValidationMessage).toBeInTheDocument();
  });

  test('password length less than 8 characters should set isSignInPasswordValid to false and show message', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short', name: 'password' } });
    const passwordValidationMessage = screen.getByText(/your password must have at least 8 characters/i);
    expect(passwordValidationMessage).toBeInTheDocument();
  });

  test('password length of 8 or more characters should set isSignInPasswordValid to true', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword', name: 'password' } });
    const passwordValidationMessage = screen.queryByText(/your password must have at least 8 characters/i);
    expect(passwordValidationMessage).not.toBeInTheDocument();
  });

  test('submit button should be disabled when form is invalid', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail', name: 'email' } });
    fireEvent.change(passwordInput, { target: { value: 'short', name: 'password' } });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button should be enabled when form is valid', () => {
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'valid@example.com', name: 'email' } });
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword', name: 'password' } });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('submitting a valid form should log the sign in data', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<SignInForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getBy