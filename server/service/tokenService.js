const jwt = require('jsonwebtoken');
const db = require('../db');

class tokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '60d'});

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch(e) {
            return null;
        }
    }
    
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
            return userData;
        } catch(e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const query = 'INSERT INTO "Token" (userid, refreshtoken) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET refreshtoken = EXCLUDED.refreshtoken RETURNING *';
        const values = [userId, refreshToken];

        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error saving token:', error);
            throw error;
        }
    }

    async removeToken(refreshToken) {
        const query = 'DELETE FROM "Token" WHERE refreshtoken = $1';
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result;
    }

    async findToken(refreshToken) {
        const query = 'SELECT * FROM "Token" WHERE refreshtoken = $1';
        const values = [refreshToken];
        const { rows } = await db.query(query, values);

        return rows[0];
    }
}

module.exports = new tokenService();