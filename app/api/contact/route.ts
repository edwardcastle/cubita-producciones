import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, country, eventDate, artist, message } = body;

    // Email to Cubita Producciones (from user)
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `Solicitud de booking de ${name}${artist ? ` - ${artist}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #000000, #D4AF37); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #000000; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #000000; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Nueva Solicitud de Booking</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Pais/Ciudad:</div>
                <div class="value">${country}</div>
              </div>
              <div class="field">
                <div class="label">Fecha del Evento:</div>
                <div class="value">${eventDate || 'No especificada'}</div>
              </div>
              <div class="field">
                <div class="label">Artista de Interes:</div>
                <div class="value">${artist || 'No especificado'}</div>
              </div>
              <div class="field">
                <div class="label">Mensaje:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Confirmation email to the user
    await transporter.sendMail({
      from: `"Cubita Producciones" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Hemos recibido tu solicitud - Cubita Producciones',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #000000, #D4AF37); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Cubita Producciones</h2>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Gracias por contactarnos. Hemos recibido tu solicitud${artist ? ` sobre <strong>${artist}</strong>` : ''} y te responderemos en las proximas 24 horas.</p>
              <p>Mientras tanto, puedes explorar nuestro catalogo de artistas en nuestra web.</p>
              <p>Saludos cordiales,<br><strong>El equipo de Cubita Producciones</strong></p>
            </div>
            <div class="footer">
              <p>Cubita Producciones - Booking de Artistas Cubanos en Europa</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Solicitud enviada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
