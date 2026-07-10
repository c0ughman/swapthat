/**
 * Submit a contact form to Netlify Forms.
 *
 * The React contact forms render client-side, so Netlify's build-time scanner
 * never sees them. Instead we declare matching static forms in
 * `public/__forms.html`.
 *
 * We POST directly to `/__forms.html` (the static file) rather than to "/".
 * With `output: "standalone"` + @netlify/plugin-nextjs, a POST to "/" is routed
 * to the Next.js SSR handler, which swallows it and returns 200 — so Netlify
 * never records the submission (success UI shows, dashboard stays empty).
 * Posting to the static asset path hits Netlify's form processor directly.
 *
 * `formName` must match a <form name="..."> in public/__forms.html.
 */
export async function submitNetlifyForm(
  formName: string,
  data: Record<string, string>,
): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();

  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Netlify form submission failed: ${res.status}`);
  }
}
