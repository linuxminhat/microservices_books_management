export const oktaConfig = {
    clientId: 'pqpr0xwrGMnEyTu0fXpBUv2Ns4l39Jvb',
    issuer: 'https://dev-duedowvrhmjgcagi.jp.auth0.com',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}