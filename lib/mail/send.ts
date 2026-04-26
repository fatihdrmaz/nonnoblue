import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY!);
  return resend;
}

export async function sendMail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  return getResend().emails.send({
    from: process.env.RESEND_FROM ?? 'NonnoBlue <ahoy@nonnoblue.com>',
    replyTo: process.env.RESEND_REPLY_TO ?? 'ahoy@nonnoblue.com',
    to,
    subject,
    react,
  });
}
