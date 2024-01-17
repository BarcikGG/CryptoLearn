const User = require('../models/user');
const db = require('../db');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService'); 
const ApiError = require('../exceptions/apiError');

class UserService {
    async registration(email, password, username) {
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
            'INSERT INTO "User" (email, username, fullname, avatar, completedCourses, boughtCourses, balance, password) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [email, username, "", "", [], [], 100.00, password]
        );

        const Query = 'SELECT * FROM "User" WHERE username = $1';
        const Result = await db.query(Query, [username]);

        const userDTO = {
            email: email,
            username: username,
            id: Result.rows[0].id,
        }

        await mailService.sendActivationMail(username, email, `${process.env.API_URL}/api/activation/${activationLink}`);
        
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

        return {
            ...tokens,
            user: user
        }
    }

    async update(id, name, fullname, city, email, imageUrl) {
        try {
            const user = await User.findOne({ _id: id });
            const candidateEmail = await User.findOne({email})
            const candidateUsername = await User.findOne({name})

            if (!user) {
                throw ApiError.NotFound("User isn't exist");
            }

            if(candidateEmail && candidateEmail._id.toString() !== id) {
                throw ApiError.BadRequest('Email is already registered');
            }
            if(candidateUsername && candidateUsername._id.toString() !== id) {
                throw ApiError.BadRequest('Username is already registered');
            }
      
            if(user.email !== email) {
                user.isVerified = false;
                const activationLink = uuid.v4();
                user.activationLink = activationLink;
                await mailService.sendActivationMail(name, email, `${process.env.API_URL}/api/activation/${activationLink}`);
            }

            user.name = name;
            user.fullname = fullname;
            user.city = city;
            user.email = email;

            if(imageUrl) user.profileImage = imageUrl;
        
            await user.save();
        
            return user;
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
        const tokenFromDB = tokenService.findToken(refreshToken);
        
        if(!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError('Unauthorized user');
        }

        const user = await User.findById(userData.id);
        return this.generateToken(user);
    }

    async getAllUsers(loggedUserId) {
        const users = await User.find({ _id: { $ne: loggedUserId}});
        return users;
    }

    async getUser(userId) {
        const user = await User.findById(userId);
        return user;
    }
}

module.exports = new UserService();