const User = require('../models/user');
const db = require('../db');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService'); 
const ApiError = require('../exceptions/apiError');

class UserService {
    async registration(email, password, username) {
        const defaultAvatar = '';
        const checkEmailQuery = 'SELECT * FROM "User" WHERE email = $1';
        const checkEmailResult = await db.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            return {
                error: true,
                message: "Пользователь с такой почтой уже существует"
            };
        }

        const checkUsernameQuery = 'SELECT * FROM "User" WHERE username = $1';
        const checkUsernameResult = await db.query(checkUsernameQuery, [username]);

        if (checkUsernameResult.rows.length > 0) {
            return {
                error: true,
                message: "Пользователь с таким логином уже существует"
            };
        }

        const activationLink = uuid.v4();
        const user = await db.query(
            'INSERT INTO "User" (email, username, fullname, avatar, balance, password, activationLink, isVerified, role) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [email, username, "", defaultAvatar, 100.00, password, activationLink, false, "user"]
        );

        const Query = 'SELECT * FROM "User" WHERE username = $1';
        const Result = await db.query(Query, [username]);

        const userDTO = {
            email: email,
            username: username,
            id: Result.rows[0].id,
        }

        //await mailService.sendActivationMail(username, email, `${process.env.API_URL}/api/activation/${activationLink}`);
        
        return this.generateToken(userDTO);
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if(!user) throw ApiError.BadRequest('Bad link')

        user.isVerified = true;
        await user.save()
    }

    async login(username, password) {
        const checkUsernameQuery = 'SELECT * FROM "User" WHERE username = $1';
        const checkUsernameResult = await db.query(checkUsernameQuery, [username]);
        const dbPassword = checkUsernameResult.rows[0].password;

        if (checkUsernameResult.rows.length == 0) {
            return {
                error: true,
                message: "Пользователь не найден"
            };
        }

        if(dbPassword !== password) {
            return {
                error: true,
                message: "неверный пароль"
            };
        }

        const userDTO = {
            email: checkUsernameResult.rows[0].email,
            username: checkUsernameResult.rows[0].username,
            id: checkUsernameResult.rows[0].id,
        }

        return this.generateToken(userDTO);
    }

    async generateToken(user) {
        const tokens = tokenService.generateToken({...user});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        //console.log(tokens.accessToken);
        return {
            ...tokens,
            user: user
        }
    }

    async update(id, username, name, surname, email, imageUrl) {
        try {
            const checkIdQuery = 'SELECT * FROM "User" WHERE id = $1';
            const checkIdResult = await db.query(checkIdQuery, [id]);
            if (checkIdResult.rows.length == 0) {
                return {
                    error: true,
                    status: 404,
                    message: "Пользователь не найден"
                };
            }

            var userEmail = checkIdResult.rows[0].email;
            var userUsername = checkIdResult.rows[0].username;
            var isVerified = checkIdResult.rows[0].isverified;
            var activationLink = checkIdResult.rows[0].activationlink;

            if(userEmail !== email) {
                const checkEmailQuery = 'SELECT * FROM "User" WHERE email = $1';
                const checkEmailResult = await db.query(checkEmailQuery, [email]);
    
                if (checkEmailResult.rows.length > 0) {
                    return {
                        error: true,
                        status: 401,
                        message: "Пользователь с такой почтой уже существует"
                    };
                }

                isVerified = false;
                const _activationLink = uuid.v4();
                activationLink = _activationLink;
                userEmail = email;
                //await mailService.sendActivationMail(name, email, `${process.env.API_URL}/api/activation/${activationLink}`);
            }

            if(userUsername !== username) {
                const checkUsernameQuery = 'SELECT * FROM "User" WHERE username = $1';
                const checkUsernameResult = await db.query(checkUsernameQuery, [username]);

                if (checkUsernameResult.rows.length > 0) {
                    return {
                        error: true,
                        status: 401,
                        message: "Пользователь с таким логином уже существует"
                    };
                }

                userUsername = username;
            }

            const updateQuery = 'UPDATE "User" SET email = $1, username = $2, name = $3, surname = $4, avatar = $5, activationlink = $6, isverified = $7 WHERE id = $8';
            const updatedUser = await db.query(updateQuery, [userEmail, userUsername, name, surname, imageUrl, activationLink, isVerified, id]);

            return updatedUser;
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
    }
      
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.Unauthorized('No token provided');
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = tokenService.findToken(userData.id);

        if(!userData || !tokenFromDB) {
            return {
                error: true,
                message: "сессия авторизации устарела"
            };
        }

        const Query = 'SELECT * FROM "User" WHERE id = $1';
        const Result = await db.query(Query, [userData.id]);

        const userDTO = {
            email: Result.rows[0].email,
            username: Result.rows[0].username,
            id: Result.rows[0].id,
        }

        return this.generateToken(userDTO);
    }

    async getHistory(userId) {
        const Query = 'SELECT * FROM "balance_history" WHERE user_id = $1';
        const Result = await db.query(Query, [userId]);

        return Result.rows.reverse();
    }

    async getUser(userId) {
        const Query = 'SELECT * FROM "User" WHERE id = $1';
        const Result = await db.query(Query, [userId]);

        return Result.rows[0];
    }

    async deposit(userId, balance, promo) {
        const checkPromoQuery = 'SELECT * FROM "promos" WHERE promo = $1';
        const checkPromoResult = await db.query(checkPromoQuery, [promo]);

        if (checkPromoResult.rows.length == 0) {
            return {
                error: true,
                message: "Неверный промокод!"
            };
        }

        const amount = checkPromoResult.rows[0].amount;

        const newBalance = Number(balance) + Number(amount);
        const updateQuery = 'UPDATE "User" SET balance = $1 WHERE id = $2';
        await db.query(updateQuery, [newBalance, userId]);

        await db.query(
            'INSERT INTO "balance_history" (user_id, amount, description, operation_type) values ($1, $2, $3, $4) RETURNING *',
            [userId, amount, "промокод", "credit"]
        );

        return newBalance;
    }
}

module.exports = new UserService();