import HTML from './index.html';
import BOOKMARKLET_JS from './bookmarklet.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
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
