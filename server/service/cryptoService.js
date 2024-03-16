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

    async buyCrypto(userId, coin, symbol, amount, image, newBalance, spent) {
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

        await db.query(
            'INSERT INTO "balance_history" (user_id, amount, description, operation_type) values ($1, $2, $3, $4) RETURNING *',
            [userId, spent, `Покупка ${symbol}`, "debit"]
        );
    
        return newBalance;
    }

    async sellCrypto(userId, coin, symbol, amount, newBalance, reward) {
        const avalable = await this.getCurrentCrypto(userId, coin);
    
        if (avalable < amount) {
            return {
                error: true,
                status: 401,
                message: "Недостаточно средств"
            };
        }

        await db.query(
            'UPDATE "UserCoins" SET amount = amount - $1 WHERE userId = $2 AND coinname = $3',
            [amount, userId, coin]
        );

        await db.query(
            'UPDATE "User" SET balance = $1 WHERE id = $2',
            [newBalance, userId]
        );

        await db.query(
            'INSERT INTO "balance_history" (user_id, amount, description, operation_type) values ($1, $2, $3, $4) RETURNING *',
            [userId, reward, `Продажа ${symbol}`, "credit"]
        );
    
        return newBalance;
    }
}

module.exports = new CyptoService();