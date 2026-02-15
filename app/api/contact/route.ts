import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {name, email, country, eventDate, artist, message} = body;

    // Here you would integrate with Resend or your email service
    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      name,
      email,
      country,
      eventDate,
      artist,
      message,
    });

    // TODO: Send email using Resend
    // const { data, error } = await resend.emails.send({
    //   from: 'Cubita Producciones <noreply@cubitaproducciones.com>',
    //   to: ['info@cubitaproducciones.com'],
    //   subject: `Nueva solicitud de booking - ${artist || 'General'}`,
    //   html: `
    //     <h2>Nueva Solicitud de Booking</h2>
    //     <p><strong>Nombre:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>País/Ciudad:</strong> ${country}</p>
    //     <p><strong>Fecha del Evento:</strong> ${eventDate || 'No especificada'}</p>
    //     <p><strong>Artista:</strong> ${artist || 'No especificado'}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return NextResponse.json(
      {message: 'Solicitud enviada exitosamente'},
      {status: 200}
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {error: 'Error al procesar la solicitud'},
      {status: 500}
    );
  }
}
