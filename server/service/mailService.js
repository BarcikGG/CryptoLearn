const nodemailer = require('nodemailer');

class mailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async sendActivationMail(name, to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Активация аккаунты CryptoLearn',
            html: 
                `
                    <div>
                        <h1>Привет, ${name}!</h1>
                        <p>Перейдите по ссылке ниже, чтобы подтвердить свой аккаунт.</p>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async sendCode(name, to, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Сброс пароля',
            html: 
                `
                    <div>
                        <h1>${name}!</h1>
                        <p>Вы начали процесс восстановления пароля, код подтверждения 👇</p>
                        <h2>${code}</h2>
                    </div>
                `
        })
    }
}

module.exports = new mailService();