const db = require('../db');

class CyptoService {
    async getCrypto(id) {
        const Query = 'SELECT * FROM "UserCoins" WHERE userid = $1';
        const Result = await db.query(Query, [id]);

        return Result.rows;
    }

    async getCurrentCrypto(userId, coin) {
        const query = 'SELECT amount FROM "UserCoins" WHERE userId = $1 AND coinname = $2';
        const result = await db.query(query, [userId, coin]);

        if(result.rows.length > 0) return result.rows[0].amount;

        return 0;
    }

    async buyCrypto(userId, coin, symbol, amount, image, newBalance) {
        const avalable = await this.getCurrentCrypto(userId, coin);
    
        if (avalable) {
            await db.query(
                'UPDATE "UserCoins" SET amount = amount + $1 WHERE userId = $2 AND coinname = $3',
                [amount, userId, coin]
            );
        } else {
            await db.query(
                'INSERT INTO "UserCoins" (userId, coinname, symbol, amount, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [userId, coin, symbol, amount, image]
            );
        }

        await db.query(
            'UPDATE "User" SET balance = $1 WHERE id = $2',
            [newBalance, userId]
        );
    
        return newBalance;
    }
}

module.exports = new CyptoService();