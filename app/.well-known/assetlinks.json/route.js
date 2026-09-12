export const dynamic = "force-dynamic";

export async function GET() {
  const fingerprint = String(process.env.ANDROID_APP_SHA256_CERT_FINGERPRINT || "")
    .trim()
    .toUpperCase();

  const body = fingerprint
    ? [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: "br.com.estibordo.pscpp",
            sha256_cert_fingerprints: [fingerprint],
          },
        },
      ]
    : [];

  return Response.json(body, {
    headers: {
      "Cache-Control": fingerprint ? "public, max-age=3600" : "no-store",
    },
  });
}
