import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
        
            name: 'Task Manager',
            link: 'https://mailgen.js/'
        
        }
    });

    const emailText = mailGenerator.generatePlaintext(options.mailGenContent)
    const emailHtml = mailGenerator.generate(options.mailGenContent)

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const mail = {
        from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        to: options.email,
        subject: options.subject,
        text: emailText, // plain‑text body
        html: emailHtml, // HTML body
    };

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email failed",error)
    }
} 

const emailVerificationMailGenContent = (userName, verificationUrl) => {
    return {
        body : {
            name : userName,
            intro : "Welcome to App, we are very excited have you on our app, Please click here:",
                action: {
                instructions: 'To get started with our App, please click here:',
                button: {
                    color: '#6ebb15ff', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const forgotPasswordMailGenContent = (userName, passwordResetUrl) => {
    return {
        body : {
            name : userName,
            intro : "we got a request to reset your password",
                action: {
                instructions: 'To change your password, Click the button:',
                button: {
                    color: '#6ebb15ff', // Optional action button color
                    text: 'Reset password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const resetPasswordMailGenContent = (userName) => {
    return {
        body : {
            name : userName,
            intro : `Your password has been changed for ${userName}`,
                action: {
                instructions: 'if this was not you reply on this email',
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const sendEmailVerificationMail = async (email, userName, link) => {
    const emailContent = emailVerificationMailGenContent(userName, link);
    await sendEmail({
        email,
        subject : "To verify your email",
        mailGenContent : emailContent
    })
}

const sendForgotPasswordMail = async (email, userName, link) => {
    const emailContent = forgotPasswordMailGenContent(userName, link);
    await sendEmail({
        email,
        subject : "To change your password, if this was not you ignore it",
        mailGenContent : emailContent
    })
}

const sendResetPassMail = async(email, userName) => {
    const emailContent = resetPasswordMailGenContent(userName);
    await sendEmail({
        email,
        subject: "Your password was changed",
        mailGenContent : emailContent
    })
}

export {sendEmailVerificationMail, sendForgotPasswordMail, sendResetPassMail}