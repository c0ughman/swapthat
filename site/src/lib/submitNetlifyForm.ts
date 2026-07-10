/**
 * Submit a contact form to Netlify Forms.
 *
 * The React contact forms render client-side, so Netlify's build-time scanner
 * never sees them. Instead we declare matching static forms in
 * `public/__forms.html`, and post here to "/" with a `form-name` field that
 * matches one of those declarations. Netlify intercepts the POST and stores the
 * submission + fires notifications configured in the dashboard.
 *
 * `formName` must match a <form name="..."> in public/__forms.html.
 */
export async function submitNetlifyForm(
  formName: string,
  data: Record<string, string>,
): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Netlify form submission failed: ${res.status}`);
  }
}
