// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// const createTransporter = async () => {
//   const oauth2Client = new OAuth2(
//     "197820296786-c017qnfa80rhk61d6jrn1fkitdc5h5n9.apps.googleusercontent.com",
//     "XBniaQ1TsN0rsaK_gK6mLGv0",
//     "https://developers.google.com/oauthplayground"
//   );

//   oauth2Client.setCredentials({
//     refresh_token: "1//04FwTomGsph6ZCgYIARAAGAQSNwF-L9IrDlFNG8KrvQqxBRck7S9Beg2It1eN3N28js08ET0g1P7bU3JggU6DqWiuBwNwnEF8qbU"
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject("Failed to create access token :(" + err);
//       }
//       resolve(token);
//     });
//   });

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: 'zyo1994@gmail.com',
//       accessToken,
//       clientId: '197820296786-c017qnfa80rhk61d6jrn1fkitdc5h5n9.apps.googleusercontent.com',
//       clientSecret: 'XBniaQ1TsN0rsaK_gK6mLGv0',
//       refreshToken: '1//04FwTomGsph6ZCgYIARAAGAQSNwF-L9IrDlFNG8KrvQqxBRck7S9Beg2It1eN3N28js08ET0g1P7bU3JggU6DqWiuBwNwnEF8qbU',
//     },
    
//   });

//   return transporter;
// };

// const sendEmail = async (emailOptions) => {
//   let emailTransporter = await createTransporter();
//   await emailTransporter.sendMail(emailOptions);
// };

// sendEmail({
//   subject: "Test",
//   text: "I am sending an email from nodemailer!",
//   to: "put_email_of_the_recipient",
//   from: 'zyo1994@gmail.com'
// });