import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Create sendMail mock
const sendMailMock = vi.fn();

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: sendMailMock,
    }),
  },
}));

describe('Contact API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMailMock.mockReset();
    sendMailMock.mockResolvedValue({ messageId: 'test-id' });

    // Setup environment variables
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@test.com';
    process.env.SMTP_PASS = 'password';
    process.env.EMAIL_FROM = 'from@test.com';
    process.env.EMAIL_TO = 'to@test.com';
  });

  describe('POST /api/contact', () => {
    const validRequestBody = {
      name: 'John Doe',
      email: 'john@example.com',
      country: 'Spain',
      eventDate: '2025-12-25',
      artist: 'Test Artist',
      message: 'I want to book this artist for my event.',
    };

    it('sends emails with correct data', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(sendMailMock).toHaveBeenCalledTimes(2);
    });

    it('returns success response', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Solicitud enviada exitosamente');
    });

    it('notification email contains user data', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request);

      const notificationEmail = sendMailMock.mock.calls[0][0];
      expect(notificationEmail.to).toBe('to@test.com');
      expect(notificationEmail.html).toContain('John Doe');
      expect(notificationEmail.html).toContain('john@example.com');
      expect(notificationEmail.html).toContain('Spain');
    });

    it('sends confirmation to user', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request);

      const confirmationEmail = sendMailMock.mock.calls[1][0];
      expect(confirmationEmail.to).toBe('john@example.com');
    });

    it('handles request without artist', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const requestBody = { ...validRequestBody, artist: '' };
      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('handles request without event date', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const requestBody = { ...validRequestBody, eventDate: '' };
      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const notificationEmail = sendMailMock.mock.calls[0][0];
      expect(notificationEmail.html).toContain('No especificada');
    });

    it('returns 500 on email error', async () => {
      sendMailMock.mockRejectedValueOnce(new Error('SMTP error'));

      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('includes replyTo header', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request);

      const notificationEmail = sendMailMock.mock.calls[0][0];
      expect(notificationEmail.replyTo).toContain('john@example.com');
    });

    it('converts newlines to br tags', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const requestBody = {
        ...validRequestBody,
        message: 'Line 1\nLine 2',
      };

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const notificationEmail = sendMailMock.mock.calls[0][0];
      expect(notificationEmail.html).toContain('<br>');
    });

    it('notification email has HTML structure', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request);

      const notificationEmail = sendMailMock.mock.calls[0][0];
      expect(notificationEmail.html).toContain('<!DOCTYPE html>');
      expect(notificationEmail.html).toContain('Nueva Solicitud de Booking');
    });

    it('confirmation email has HTML structure', async () => {
      const { POST } = await import('@/app/api/contact/route');

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request);

      const confirmationEmail = sendMailMock.mock.calls[1][0];
      expect(confirmationEmail.html).toContain('<!DOCTYPE html>');
      expect(confirmationEmail.html).toContain('Gracias por contactarnos');
    });
  });
});
