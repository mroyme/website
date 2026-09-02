export function GET() {
  return new Response('dh=8192488b09c51d38ab173c7e0f74f59d145727c2', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
