import nodemailer from 'nodemailer';

class SendMail {
  constructor() {
    this.from = 'usof.test1@gmail.com';
    this.password = 'madoasxztqtjarpn';
    this.origin = 'http://localhost:8080/';
  }
  send(to, uuid, type) {
    const massageEmail = {};
    if (type === 'activate') {
      massageEmail.subject = 'Activate email Link - usof-backend.com';
      massageEmail.html = `
       <div>
            <p>
                Thank you for registering, for confirmation  email follow the
                    <a href="${this.origin}api/auth/confirm-email/${uuid}">
                    link
                    </a>
            </p>
        </div>
        `;
    } else {
      massageEmail.subject = 'Reset password link - usof-backend.com';
      massageEmail.html = `
        <div>
            <p>
                You requested for reset password, kindly use this to reset your password
                <a href="${this.origin}reset-password/${uuid}">link</a>
            </p>
        </div>
        `;
    }
    const mail = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.from,
        pass: this.password,
      },
    });
    const mailOptions = {
      from: this.from,
      to,
      subject: massageEmail.subject,
      text: '',
      html: massageEmail.html,
    };
    return mail.sendMail(mailOptions);
  }
}

export default SendMail;
