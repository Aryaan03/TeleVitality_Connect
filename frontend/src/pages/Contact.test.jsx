import { render, screen, fireEvent, act } from '@testing-library/react';
import ContactPage from './Contact';

test('submits form successfully with valid inputs', async () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  render(<ContactPage />);

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Inquiry' } });
    fireEvent.change(screen.getByLabelText(/Your Message/i), { target: { value: 'This is a test message.' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
  });

  expect(mockConsoleLog).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Inquiry',
    message: 'This is a test message.',
  });

  mockConsoleLog.mockRestore();
});
