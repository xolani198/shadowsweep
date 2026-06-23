// Defense-in-depth CSRF check for state-changing API routes.
//
// Our session cookie is SameSite=Lax and our APIs accept JSON (which forces a
// CORS preflight for cross-origin callers), so cross-site forgery is already
// hard. This adds an explicit same-origin assertion: if the request carries an
// Origin/Referer header, it must match the Host the request arrived on.

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin") || request.headers.get("referer");
  if (!origin) return true; // non-browser / same-origin navigations omit Origin

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
