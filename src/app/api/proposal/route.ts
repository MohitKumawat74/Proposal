import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase';

// Lazily initialised so missing env vars only throw at request-time, not build-time
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('Missing env variable: RESEND_API_KEY');
    _resend = new Resend(key);
  }
  return _resend;
}

/* ─── Email HTML template ─────────────────────────────────────────────────
   Self-contained, inline-styled for maximum email client compatibility.     */
function buildEmailHtml(name: string, acceptedAt: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Proposal Accepted 💖</title>
</head>
<body style="margin:0;padding:0;background:#1a0025;font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:linear-gradient(135deg,#1a0025 0%,#2d0040 50%,#1a0025 100%);min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;"
               cellpadding="0" cellspacing="0">
          <tr>
            <td style="
              background:rgba(255,20,147,0.10);
              border:1px solid rgba(255,105,180,0.28);
              border-radius:24px;
              padding:48px 40px;
              text-align:center;
              box-shadow:0 8px 40px rgba(233,30,140,0.25);
            ">

              <!-- Icon -->
              <div style="font-size:72px;line-height:1;margin-bottom:24px;">💖</div>

              <!-- Badge -->
              <div style="
                display:inline-block;
                background:rgba(255,20,147,0.18);
                border:1px solid rgba(255,105,180,0.35);
                border-radius:999px;
                padding:6px 20px;
                margin-bottom:28px;
              ">
                <span style="color:#ff69b4;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-family:Arial,sans-serif;">
                  Proposal Accepted
                </span>
              </div>

              <!-- Headline -->
              <h1 style="
                margin:0 0 8px;
                font-size:32px;
                font-weight:700;
                background:linear-gradient(135deg,#ff6eb4,#ff1493,#ffb3d9);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
                color:#ff69b4;
              ">
                She Said YES! 🎉
              </h1>

              <!-- Sub-line -->
              <p style="color:#ffb3d9;font-size:16px;margin:0 0 36px;font-style:italic;line-height:1.6;">
                Your proposal was just accepted ❤️
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid rgba(255,105,180,0.2);margin:0 0 32px;" />

              <!-- Details table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:32px;">
                <!-- Name row -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,105,180,0.12);">
                    <span style="color:#ff69b4;font-family:Arial,sans-serif;font-size:13px;
                                 text-transform:uppercase;letter-spacing:0.1em;">Her Name</span>
                    <br />
                    <span style="color:#fff0f5;font-size:20px;font-weight:700;">${name}</span>
                  </td>
                </tr>
                <!-- Status row -->
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,105,180,0.12);">
                    <span style="color:#ff69b4;font-family:Arial,sans-serif;font-size:13px;
                                 text-transform:uppercase;letter-spacing:0.1em;">Response</span>
                    <br />
                    <span style="color:#fff0f5;font-size:20px;font-weight:700;">YES ❤️</span>
                  </td>
                </tr>
                <!-- Time row -->
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#ff69b4;font-family:Arial,sans-serif;font-size:13px;
                                 text-transform:uppercase;letter-spacing:0.1em;">Accepted At</span>
                    <br />
                    <span style="color:#ffb3d9;font-size:15px;">${acceptedAt}</span>
                  </td>
                </tr>
              </table>

              <!-- Quote -->
              <p style="
                color:rgba(255,179,217,0.6);
                font-size:14px;
                font-style:italic;
                margin:0;
                line-height:1.7;
              ">
                &ldquo;And so, your love story begins... 🌹&rdquo;
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <p style="color:rgba(255,105,180,0.3);font-size:12px;margin-top:32px;
                  font-family:Arial,sans-serif;text-align:center;">
          Sent with love 💌
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/* ─── POST /api/proposal ──────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  // 1. Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    typeof (body as Record<string, unknown>).name !== 'string'
  ) {
    return NextResponse.json({ error: 'Field "name" is required.' }, { status: 400 });
  }

  const name = ((body as Record<string, unknown>).name as string).trim();

  if (!name || name.length < 1 || name.length > 80) {
    return NextResponse.json(
      { error: 'Name must be between 1 and 80 characters.' },
      { status: 400 },
    );
  }

  const acceptedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 2. Insert into Supabase
  const { error: dbError } = await getSupabaseAdmin()
    .from('Proposal')
    .insert({ name, accepted: true });

  if (dbError) {
    console.error('[proposal] Supabase insert error:', dbError);
    return NextResponse.json(
      {
        error: 'Failed to save proposal.',
        detail: dbError.message,
        code: dbError.code,
        hint: (dbError as Record<string, unknown>).hint ?? null,
      },
      { status: 500 },
    );
  }

  // 3. Send email via Resend (optional — skipped if env vars are missing)
  const toEmail = process.env.NOTIFICATION_EMAIL ?? process.env.RESEND_FROM_EMAIL;
  const hasResend = Boolean(process.env.RESEND_API_KEY);

  if (toEmail && hasResend) {
    await getResend().emails.send({
      from: 'Proposal <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'New Proposal Accepted ❤️',
      html: buildEmailHtml(name, acceptedAt),
    });
  }

  // 4. Success
  return NextResponse.json({ success: true, name }, { status: 200 });
}
