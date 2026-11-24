const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  window: process.env.WINDOW,
  max_limit: process.env.MAX_LIMIT,
  port: process.env.PORT,
  secret: process.env.SECRET,
  access_key: process.env.ACCESS_KEY,
  mongo_string: process.env.MONGODB_URI,
  mail_host: process.env.MAIL_HOST,
  mail_port: process.env.MAIL_PORT,
  mail_username: process.env.MAIL_USERNAME,
  mail_password: process.env.MAIL_PASSWORD,
  mail_from_address: process.env.MAIL_FROM_ADDRESS,
  mail_from_name: process.env.MAIL_FROM_NAME,
  otp_secret_key: process.env.OPT_SECRET_KEY,
  twillo_account_ssid: process.env.TWILLO_ACCOUNT_SSID,
  twillo_auth_token: process.env.TWILLO_AUTH_TOKEN,
  twillo_number: process.env.TWILLO_NUMBER,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  sendgrid_user_name: process.env.SENDGRID_USER_NAME,
  sendgrid_host: process.env.SENDGRID_HOST,
  sendgrid_port: process.env.SENDGRID_PORT,
  sendgrid_email_from: process.env.SENDGRID_FROM_EMAIL,
  stripe_secrete_key: process.env.STRIPE_SECRETE_KEY,
};
