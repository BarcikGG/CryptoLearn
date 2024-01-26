const userService = require('../service/userService');

class UserController {
    async registration(req, res, next) {
        try {
            // const errors = validationResult(req);
            // if(!errors.isEmpty()) {
            //     return next(ApiError.BadRequest('Validation error', errors.array()));
            // }

            const { username, email, password} = req.body;
            if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields'});

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

    // async update(req, res, next) {
    //     try {
    //         const id = req.body.id;
    //         const username = req.body.name;
    //         const fullname = req.body.fullname;
    //         const email = req.body.email;
    //         const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    //         const updateUser = await userService.update(id, username, fullname, email, imageUrl);

    //         return res.json(updateUser);
    //     } catch(e) {
    //         next(e);
    //     }
    // }

    // async updateNoImg(req, res, next) {
    //     try {
    //         const errors = validationResult(req);
    //         if(!errors.isEmpty()) {
    //             return next(ApiError.BadRequest('Validation error', errors.array()));
    //         }
            
    //         const {id, usernname, fullname, email } = req.body;
    //         const imageUrl = null;

    //         const updateUser = await userService.update(id, name, fullname, email, imageUrl);

    //         return res.json(updateUser);
    //     } catch(e) {
    //         next(e);
    //     }
    // }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            res.json(token);
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

    async getCourses(req, res, next) {
        try {
            const type = req.params.type;
            const courses = await userService.getCourses(type);
            
            return res.json(courses);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new UserController();