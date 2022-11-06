import nodemailer from 'nodemailer';

class SendMail {
  // constructor(userEmail) {
  //   this.from = 'jeremie.kovacek62@ethereal.email';
  //   this.password = 'KR86tMYjvYngURhFwM';
  // }
  constructor () {
    this.transporter = nodemailer.createTransport({
        host: process.env.ETHEREAL_EMAIL_HOST,
        port: process.env.ETHEREAL_EMAIL_PORT,
        auth: {
            user: process.env.ETHEREAL_EMAIL_ADDRESS,
            pass: process.env.ETHEREAL_EMAIL_PWD
        }
    });

    this.mailOptions = {
        from: process.env.ETHEREAL_EMAIL_ADDRESS,
        to: '',
        subject: '',
        text: '',
        html: ``,
    };
}

sendEmailConfirm(emailAddres, name, token) {
    this.mailOptions.subject = "Mail confirmation";
    this.mailOptions.to = 'jeremie.kovacek62@ethereal.email';
    this.mailOptions.html = `<h2>Hello, ${name}</h2>
    <div>Thank You for registering. To confirm Your email, please click on the following link:</div>
    <div><a href="http://localhost:8080/api/auth/emailact/${token}">Confirm email</a></div>`;

    this.transporter.sendMail(this.mailOptions).catch(e => console.log("PIZDEC NA PO4TE 1" + e));
}

sendEmailPassChangeConfirm(emailAddres, name, token) {
    this.mailOptions.subject = "Password change confirmation";
    this.mailOptions.to = 'jeremie.kovacek62@ethereal.email';
    this.mailOptions.html =
    `<h2>Hello, ${name}</h2>
    <div>You requested a password change. To confirm it, please click on the following link:</div>
    <div><a href="http://localhost:8080/api/auth/password-reset/${token}">Change my password</a></div>
    <div>If it wasn't You, we strongly recommend to change Your password users_login_keyright now.</div>`;

    this.transporter.sendMail(this.mailOptions).catch(e => console.log("PIZDEC NA PO4TE 2" + e));
}

}

export default SendMail;