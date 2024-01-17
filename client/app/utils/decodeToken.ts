export default function decodeToken(token: any) {
    const atob = require('abab').atob;
    
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('The token is not valid JWT token');
    }
    const decoded = atob(parts[1]);
    if (!decoded) {
        throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
}