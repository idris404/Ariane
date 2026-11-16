import type { NextRequest } from 'next/server'

const FORWARDED_REQUEST_HEADERS = ['accept', 'content-type', 'cookie'] as const
const FORWARDED_RESPONSE_HEADERS = ['cache-control', 'content-type', 'set-cookie'] as const

type RouteContext = {
  params: Promise<{ path: string[] }>
}

function unavailable(detail: string): Response {
  return Response.json({ detail }, { status: 503 })
}

async function proxy(request: NextRequest, context: RouteContext): Promise<Response> {
  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) {
    return unavailable('BACKEND_UNAVAILABLE')
  }

  const { path } = await context.params
  if (path[0] !== 'api' || path[1] !== 'v1') {
    return Response.json({ detail: 'ROUTE_NOT_FOUND' }, { status: 404 })
  }

  const target = new URL(path.map(encodeURIComponent).join('/'), `${backendUrl.replace(/\/$/, '')}/`)
  target.search = request.nextUrl.search

  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value !== null) headers.set(name, value)
  }

  try {
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'manual',
    })
    const responseHeaders = new Headers()
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name)
      if (value !== null) responseHeaders.set(name, value)
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch {
    return unavailable('BACKEND_UNAVAILABLE')
  }
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const DELETE = proxy
