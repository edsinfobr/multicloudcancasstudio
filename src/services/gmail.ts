import { loadGisScript, getGoogleClientId, GoogleUser } from './googleDrive';

export interface GmailSendOptions {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  accessToken: string;
  attachmentFileName?: string;
  attachmentContent?: string; // base64 or raw string
  attachmentMimeType?: string;
}

// Convert string / unicode to Base64URL encoding required by Gmail API
function base64UrlEncode(str: string): string {
  // Use TextEncoder to handle UTF-8 properly
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Construct raw RFC 2822 email message and send via Gmail API
 */
export async function sendGmailEmail(options: GmailSendOptions): Promise<{ id: string; threadId: string }> {
  const { to, subject, bodyText, bodyHtml, accessToken, attachmentFileName, attachmentContent, attachmentMimeType } = options;

  let messageLines: string[] = [];

  if (attachmentFileName && attachmentContent) {
    const boundary = '===_MultiCloud_Studio_Gmail_Boundary_===';
    messageLines.push(`To: ${to}`);
    messageLines.push(`Subject: =?UTF-8?B?${btoa(new TextDecoder().decode(new TextEncoder().encode(subject)))}?=`);
    messageLines.push(`MIME-Version: 1.0`);
    messageLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    messageLines.push('');
    messageLines.push(`--${boundary}`);
    messageLines.push(`Content-Type: text/html; charset=UTF-8`);
    messageLines.push(`Content-Transfer-Encoding: 7bit`);
    messageLines.push('');
    messageLines.push(bodyHtml || `<p>${bodyText.replace(/\n/g, '<br/>')}</p>`);
    messageLines.push('');
    messageLines.push(`--${boundary}`);
    messageLines.push(`Content-Type: ${attachmentMimeType || 'application/json'}; name="${attachmentFileName}"`);
    messageLines.push(`Content-Disposition: attachment; filename="${attachmentFileName}"`);
    messageLines.push(`Content-Transfer-Encoding: base64`);
    messageLines.push('');
    
    // Ensure base64 string
    const base64Attachment = attachmentContent.includes('base64,')
      ? attachmentContent.split('base64,')[1]
      : btoa(attachmentContent);
    messageLines.push(base64Attachment);
    messageLines.push(`--${boundary}--`);
  } else {
    messageLines.push(`To: ${to}`);
    messageLines.push(`Subject: =?UTF-8?B?${btoa(new TextDecoder().decode(new TextEncoder().encode(subject)))}?=`);
    messageLines.push(`MIME-Version: 1.0`);
    messageLines.push(`Content-Type: text/html; charset=UTF-8`);
    messageLines.push('');
    messageLines.push(bodyHtml || `<p>${bodyText.replace(/\n/g, '<br/>')}</p>`);
  }

  const rawMessage = messageLines.join('\r\n');
  const encodedRaw = base64UrlEncode(rawMessage);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedRaw })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Erro ao enviar e-mail via Gmail (${res.status})`);
  }

  return await res.json();
}

/**
 * Create a draft message in Gmail
 */
export async function createGmailDraft(options: GmailSendOptions): Promise<{ id: string }> {
  const { to, subject, bodyText, bodyHtml, accessToken } = options;

  const messageLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    '',
    bodyHtml || `<p>${bodyText.replace(/\n/g, '<br/>')}</p>`
  ];

  const rawMessage = messageLines.join('\r\n');
  const encodedRaw = base64UrlEncode(rawMessage);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: { raw: encodedRaw }
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Erro ao criar rascunho no Gmail (${res.status})`);
  }

  return await res.json();
}
