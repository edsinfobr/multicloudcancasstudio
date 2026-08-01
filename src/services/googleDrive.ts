export interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
  accessToken: string;
  expiresAt: number;
}

export interface DriveFileItem {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  size?: string;
}

// Dynamically load Google Identity Services script if not present
export function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-gis-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

// Fetch OAuth Client ID from server
export async function getGoogleClientId(): Promise<string> {
  try {
    const res = await fetch('/api/auth/google/config');
    if (res.ok) {
      const data = await res.json();
      if (data.clientId) return data.clientId;
    }
  } catch (err) {
    console.warn('Could not fetch google auth config from server', err);
  }
  return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
}

// Trigger Google OAuth popup flow
export async function authenticateWithGoogle(customClientId?: string): Promise<GoogleUser> {
  await loadGisScript();
  const clientId = customClientId || (await getGoogleClientId());

  if (!clientId) {
    throw new Error('OAuth Client ID não configurado. Por favor, certifique-se de que o OAuth do Google está configurado no projeto.');
  }

  return new Promise((resolve, reject) => {
    try {
      const google = (window as any).google;
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }

          const accessToken = response.access_token;
          const expiresIn = response.expires_in || 3600;
          const expiresAt = Date.now() + expiresIn * 1000;

          try {
            // Fetch User Profile
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!profileRes.ok) {
              throw new Error('Falha ao obter perfil do usuário');
            }

            const profile = await profileRes.json();
            const user: GoogleUser = {
              name: profile.name || profile.email || 'Usuário Google',
              email: profile.email || 'usuario@gmail.com',
              picture: profile.picture,
              accessToken,
              expiresAt
            };

            // Cache in local storage
            localStorage.setItem('cloudcraft_google_user', JSON.stringify(user));
            resolve(user);
          } catch (err: any) {
            reject(err);
          }
        }
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
}

// Upload file to Google Drive (JSON or PNG or PDF)
export async function uploadToGoogleDrive({
  fileName,
  content,
  mimeType,
  accessToken,
  folderId
}: {
  fileName: string;
  content: string | Blob;
  mimeType: string;
  accessToken: string;
  folderId?: string;
}): Promise<DriveFileItem> {
  const metadata: any = {
    name: fileName,
    mimeType: mimeType
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = 'foo_bar_baz_cloudcraft';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  let body: string;
  if (typeof content === 'string') {
    body =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;
  } else {
    // For Blob / Image binary
    const reader = new FileReader();
    const base64Data = await new Promise<string>((resolve) => {
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(content);
    });

    body =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n` +
      base64Data +
      closeDelimiter;
  }

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime,size', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: body
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Erro ao enviar para o Google Drive (${res.status})`);
  }

  return await res.json();
}

// List JSON files in Google Drive saved by this app
export async function listDriveDiagrams(accessToken: string): Promise<DriveFileItem[]> {
  const query = encodeURIComponent("mimeType='application/json' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,modifiedTime,webViewLink,size)&orderBy=modifiedTime desc&pageSize=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error('Erro ao listar arquivos do Google Drive');
  }

  const data = await res.json();
  return data.files || [];
}

// Read JSON file content from Google Drive
export async function downloadDriveFileContent(fileId: string, accessToken: string): Promise<string> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error('Erro ao carregar conteúdo do arquivo no Google Drive');
  }

  return await res.text();
}
