import Anthropic from '@anthropic-ai/sdk';
import { buildChatContext } from '@/lib/chat-context';

const anthropic = new Anthropic();

const LOCALE_NAMES: Record<string, string> = {
  es: 'Spanish',
  en: 'English',
  fr: 'French',
  it: 'Italian',
};

export async function POST(request: Request) {
  try {
    const { messages, locale } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages are required' }, { status: 400 });
    }

    const validLocale = (['es', 'en', 'fr', 'it'] as const).includes(locale)
      ? (locale as 'es' | 'en' | 'fr' | 'it')
      : 'es';

    const context = await buildChatContext(validLocale);
    const languageName = LOCALE_NAMES[validLocale] || 'Spanish';

    const systemPrompt = `You are a helpful assistant for Cubita Producciones, a Cuban artists booking agency based in Europe. You answer questions from visitors about our artists, services, contact information, and company details.

RULES:
- Only answer based on the information provided below. Never invent or assume information not present in the context.
- Always respond in ${languageName}.
- Keep answers short and direct. 2-3 sentences max unless the user asks for detail.
- When listing artists, just mention their name and genre. Only share full bio details if the user asks about a specific artist.
- If asked whether there will be more artists, say yes, more are coming in the future, and if they want a specific artist they can request it through the contact page.
- When the user asks how to contact us or wants to get in touch, include a clickable link like: [here](/contacto)
- If asked about prices or rates, say that pricing depends on the event and they should contact us directly [here](/contacto)
- For booking inquiries, direct users to the contact page or provide the contact email/phone.
- Never say you don't have information. If you're unsure about something, say they can contact us directly for more details [here](/contacto).
- If asked whether travel is included in the price, say it's normally included, but for more details they can contact us [here](/contacto).
- Do not use markdown formatting in your responses, except for links. Use plain text only.
- When linking to the contact page, use a markdown link like [here](/contacto) so it's clickable.

WEBSITE CONTENT:
${context}`;

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                controller.enqueue(encoder.encode(delta.text));
              }
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
