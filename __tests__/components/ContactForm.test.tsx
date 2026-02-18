import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/ContactForm';

const mockArtists = [
  { id: '1', name: 'Artist One' },
  { id: '2', name: 'Artist Two' },
];

const mockLabels = {
  name: 'Nombre',
  email: 'Email',
  country: 'País',
  date: 'Fecha del evento',
  artist: 'Artista de interés',
  message: 'Mensaje',
  submit: 'Enviar mensaje',
};

const defaultProps = {
  artists: mockArtists,
  labels: mockLabels,
  successMessage: 'Mensaje enviado correctamente',
  errorMessage: 'Error al enviar el mensaje',
  sendingText: 'Enviando...',
  selectArtistPlaceholder: 'Seleccionar artista...',
};

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha del evento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/artista de interés/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    });

    it('renders submit button with correct label', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('renders artist select with all options', () => {
      render(<ContactForm {...defaultProps} />);

      const select = screen.getByLabelText(/artista de interés/i);
      expect(select).toBeInTheDocument();

      // Check for placeholder option
      expect(screen.getByText('Seleccionar artista...')).toBeInTheDocument();

      // Check for artist options
      mockArtists.forEach((artist) => {
        expect(screen.getByText(artist.name)).toBeInTheDocument();
      });
    });

    it('renders required field indicators', () => {
      render(<ContactForm {...defaultProps} />);

      // Name, email, country, and message are required (marked with *)
      const labels = screen.getAllByText(/\*/);
      expect(labels.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Form Interactions', () => {
    it('allows typing in text inputs', async () => {
      const user = userEvent.setup();
      render(<ContactForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/nombre/i);
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
    });

    it('allows typing in email input', async () => {
      const user = userEvent.setup();
      render(<ContactForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      expect(emailInput).toHaveValue('john@example.com');
    });

    it('allows selecting an artist', async () => {
      const user = userEvent.setup();
      render(<ContactForm {...defaultProps} />);

      const select = screen.getByLabelText(/artista de interés/i);
      await user.selectOptions(select, 'Artist One');

      expect(select).toHaveValue('Artist One');
    });

    it('allows typing in message textarea', async () => {
      const user = userEvent.setup();
      render(<ContactForm {...defaultProps} />);

      const messageInput = screen.getByLabelText(/mensaje/i);
      await user.type(messageInput, 'This is a test message');

      expect(messageInput).toHaveValue('This is a test message');
    });

    it('allows selecting a date', async () => {
      const user = userEvent.setup();
      render(<ContactForm {...defaultProps} />);

      const dateInput = screen.getByLabelText(/fecha del evento/i);
      await user.type(dateInput, '2025-12-25');

      expect(dateInput).toHaveValue('2025-12-25');
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data on success', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm {...defaultProps} />);

      // Fill out the form
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('John Doe'),
        });
      });
    });

    it('shows success message after successful submission', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(screen.getByText('Mensaje enviado correctamente')).toBeInTheDocument();
      });
    });

    it('shows error message after failed submission', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Error' }),
      });

      render(<ContactForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(screen.getByText('Error al enviar el mensaje')).toBeInTheDocument();
      });
    });

    it('shows sending text while submitting', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      global.fetch = vi.fn().mockReturnValueOnce(fetchPromise);

      render(<ContactForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      // Check for sending text
      expect(screen.getByText('Enviando...')).toBeInTheDocument();

      // Resolve the promise
      resolvePromise!({ ok: true, json: () => Promise.resolve({}) });
    });

    it('disables submit button while sending', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      global.fetch = vi.fn().mockReturnValueOnce(fetchPromise);

      render(<ContactForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      // Check button is disabled
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      // Resolve the promise
      resolvePromise!({ ok: true, json: () => Promise.resolve({}) });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      });

      render(<ContactForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/nombre/i);
      await user.type(nameInput, 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(nameInput).toHaveValue('');
      });
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      render(<ContactForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/país/i), 'Spain');
      await user.type(screen.getByLabelText(/mensaje/i), 'Test message');

      // Submit
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      await waitFor(() => {
        expect(screen.getByText('Error al enviar el mensaje')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<ContactForm {...defaultProps} />);

      expect(document.querySelector('form')).toBeInTheDocument();
    });

    it('all inputs have associated labels', () => {
      render(<ContactForm {...defaultProps} />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('required inputs have required attribute', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByLabelText(/nombre/i)).toBeRequired();
      expect(screen.getByLabelText(/email/i)).toBeRequired();
      expect(screen.getByLabelText(/país/i)).toBeRequired();
      expect(screen.getByLabelText(/mensaje/i)).toBeRequired();
    });

    it('email input has email type', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    });

    it('date input has date type', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByLabelText(/fecha del evento/i)).toHaveAttribute('type', 'date');
    });
  });
});
