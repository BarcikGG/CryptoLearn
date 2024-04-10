const userService = require('../service/userService');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

class UserController {

    async registration(req, res, next) {
        try {
            const { username, email, password} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.status(400).json({ errors: errors.array() });
            }

            if (!username || !email || !password) return res.status(400).json({ error: 'Не все поля заполнены'});

            const userData = await userService.registration(email, password, username);
            return res.json({userData});
        } catch(e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password} = req.body;
            const userData = await userService.login(username, password);
            
            return res.json({userData});
        } catch(e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.body.id;
            const username = req.body.username;
            const name = req.body.name;
            const surname = req.body.surname;
            const email = req.body.email;
            var imageUrl = req.body.image;

            
            if(req.file) {
                const uploadedFileName = `${id}-${req.file.originalname}`;
                const uploadPath = path.join('C:\\Users\\danil\\Desktop\\CryptoLearn\\server', 'uploads', uploadedFileName);
                fs.writeFileSync(uploadPath, req.file.buffer);
                
                imageUrl = `/uploads/${uploadedFileName}`;
            }
            
            const updatedUser = await userService.update(id, username, name, surname, email, imageUrl);

            return res.json({updatedUser});
        } catch(e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            res.json(token);
        } catch(e) {
            next(e);
        }
    }

    async send_code(req, res, next) {
        try {
            const email = req.params.email;
            const code = await userService.send_code(email);

            return res.json({code});
        } catch(e) {
            next(e);
        }
    }

    async reset(req, res, next) {
        try {
            const { email, password}  = req.body;
            await userService.reset(email, password);

            return res.json();
        } catch(e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);

            return res.redirect('https://vk.com');
        } catch(e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const userData = await userService.refresh(refreshToken);
            
            return res.json({userData});
        } catch(e) {
            next(e);
        }
    }

    async getHostoryBalance(req, res, next) {
        try {
            const userId = req.params.userId;
            const history = await userService.getHistory(userId);
            
            return res.json(history);
        } catch(e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const user = await userService.getUser(userId);
            
            return res.json(user);
        } catch(e) {
            next(e);
        }
    }

    async deposit(req, res, next) {
        try {
            const {userId, balance, promo} = req.body;
            const newBalance = await userService.deposit(userId, balance, promo);
            
            return res.json(newBalance);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new UserController();