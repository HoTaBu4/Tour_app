import nodeMailer from "nodemailer";
import pug from "pug";
import { htmlToText } from "html-to-text";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class Email {
  constructor( user , url ) {
    this.user = user;
    this.url = url;
    this.to = user.email;
    this.from = `Your Name <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1
    } 
    return nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
      }
      //activate in gmail "less secure app" option

      //define the email options
    })
  }

  async send(template, subject) {

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      firstName: this.user.name.split(' ')[0],
      url: this.url,
      subject
    })

    //define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText(html)
    }
    //create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  sendWelcome() {
    return this.send('welcome', 'Welcome to the Natours Family!');
  }
  //create a transport and send email
}

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOptions);
}

export default sendEmail;
