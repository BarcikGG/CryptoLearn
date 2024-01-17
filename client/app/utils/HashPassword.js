import crypto from 'crypto-js';

export default function hashPassword(password) {
    return crypto.SHA256(password).toString();
}