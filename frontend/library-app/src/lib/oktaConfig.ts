export const oktaConfig = {
    clientId: 'test-client-id',
    issuer: 'https://dev-test.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}