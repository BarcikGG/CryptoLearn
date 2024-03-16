const cryptoService = require('../service/cryptoService');

class CryptoController {
    async getCrypto(req, res, next) {
        try {
            const id = req.params.userId;
            const coins = await cryptoService.getCrypto(id);
            
            return res.json(coins);
        } catch(e) {
            next(e);
        }
    }

    async getAvalableCrypto(req, res, next) {
        try {
            const userId = req.params.userId;
            const coin = req.params.coin;

            const avalable = await cryptoService.getCurrentCrypto(userId, coin);
            
            return res.json(avalable);
        } catch(e) {
            next(e);
        }
    }

    async buyCrypto(req, res, next) {
        try {
            const { userId, coin, symbol, amount, image, balance, spent } = req.body;

            if (!userId || !coin || !symbol || !amount || !image || !balance || !spent) {
                return res.status(401).json({ error: "Не все поля заполнены" });
            }    

            const _amount = Number(amount.replace(',', '.'));
            const _newBalance = Number(balance.replace(',', '.'));
            const _spent = Number(spent.replace(',', '.'))

            const _balance = await cryptoService.buyCrypto(userId, coin, symbol, _amount, image, _newBalance, _spent);
            return res.json({_balance});
        } catch(e) {
            next(e);
        }
    }

    async sellCrypto(req, res, next) {
        try {
            const { userId, coin, symbol, amount, balance, reward } = req.body;

            if (!userId || !coin || !amount || !balance || !reward) {
                return res.status(401).json({ error: "Не все поля заполнены" });
            }    

            const _amount = Number(amount.replace(',', '.'));
            const _newBalance = Number(balance.replace(',', '.'));
            const _reward = Number(reward.replace(',', '.'));

            const _balance = await cryptoService.sellCrypto(userId, coin, symbol, _amount, _newBalance, _reward);
            return res.json({_balance});
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new CryptoController();