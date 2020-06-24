const nodemailer = require("nodemailer");
const to = require("await-to-js").default;

const smtp = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async ({ email, resetToken }) => {
  const [error, info] = await to(
    smtp.sendMail({
      from: "Administrator <atreychik@gmail.com>",
      to: email,
      subject: "Password reset",
      text: `For reset password visit this link ${
        process.env.API_BASE + "/auth/resetpassword/" + resetToken
      }`,
    })
  );

  if (error) return [error, undefined];

  return [undefined, info];
};

module.exports = { sendMail };
