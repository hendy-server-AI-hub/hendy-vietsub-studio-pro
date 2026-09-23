import HTML from './index.html';
import BOOKMARKLET_JS from './bookmarklet.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Workers AI translate - FREE, no API key
    if (url.pathname === '/api/translate' && request.method === 'POST') {
      try {
        const { text } = await request.json();
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: 'You are a professional subtitle translator. Translate the following text to Vietnamese. Keep the meaning natural and cinematic. Only output the translation, nothing else.' },
            { role: 'user', content: text }
          ]
        });
        return Response.json({ translated: response.response.trim() });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    if (url.pathname === '/bookmarklet.js') {
      return new Response(BOOKMARKLET_JS, {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};
