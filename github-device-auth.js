require('dotenv').config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const SCOPE = process.env.GITHUB_SCOPE || 'read:user user:email';

const DEVICE_CODE_URL = 'https://github.com/login/device/code';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

if (!CLIENT_ID) {
  console.error('Missing GITHUB_CLIENT_ID.');
  console.error('Add it to a .env file, for example:');
  console.error('GITHUB_CLIENT_ID=your_client_id_here');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postForm(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`GitHub returned HTTP ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function requestDeviceCode() {
  const result = await postForm(DEVICE_CODE_URL, {
    client_id: CLIENT_ID,
    scope: SCOPE,
  });

  if (result.error) {
    throw new Error(`Device code request failed: ${JSON.stringify(result)}`);
  }

  return result;
}

async function pollForAccessToken(deviceCode, initialInterval) {
  let interval = initialInterval || 5;

  while (true) {
    await sleep(interval * 1000);

    const result = await postForm(ACCESS_TOKEN_URL, {
      client_id: CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });

    if (result.access_token) {
      return result.access_token;
    }

    if (result.error === 'authorization_pending') {
      process.stdout.write('.');
      continue;
    }

    if (result.error === 'slow_down') {
      interval += 5;
      process.stdout.write('\nGitHub asked us to slow down. Waiting longer...\n');
      continue;
    }

    if (result.error === 'expired_token') {
      throw new Error('The device code expired. Run this command again.');
    }

    if (result.error === 'access_denied') {
      throw new Error('Authorization was denied in GitHub.');
    }

    throw new Error(`Access token request failed: ${JSON.stringify(result)}`);
  }
}

async function getGitHubUser(accessToken) {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`GitHub user request failed: ${JSON.stringify(body)}`);
  }

  return body;
}

async function main() {
  const device = await requestDeviceCode();

  console.log('Open this URL in your browser:');
  console.log(device.verification_uri);
  console.log('');
  console.log('Enter this code:');
  console.log(device.user_code);
  console.log('');
  console.log('Waiting for approval in GitHub...');

  const token = await pollForAccessToken(device.device_code, device.interval);
  const user = await getGitHubUser(token);

  console.log('\nAuthenticated successfully.');
  console.log(`GitHub user: ${user.login}`);
  console.log(`Access token: ${token}`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
