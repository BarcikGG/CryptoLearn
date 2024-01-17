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
            subject: 'Account activation on CryptoLearn',
            html: 
                `
                    <div>
                        <h1>Hello ${name}!</h1>
                        <p>Please click on the following link to activate your account.</p>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new mailService();