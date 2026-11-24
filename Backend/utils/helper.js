const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const {
  secret,
  mail_host,
  mail_port,
  mail_username,
  mail_password,
  mail_from_name,
  mail_from_address,
  stripe_secrete_key,
  sendgrid_api_key,
  sendgrid_email_from,
  sendgrid_host,
  sendgrid_port,
  sendgrid_user_name,
} = require('../configs');

const stripe = require('stripe')(stripe_secrete_key);
sgMail.setApiKey(sendgrid_api_key);

const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  hashPassword: password => {
    const salt = bcryptjs.genSaltSync(10);
    const passwordHashed = bcryptjs.hashSync(password, salt);
    return passwordHashed;
  },
  generateToken: payload => {
    const token = jwt.sign(payload, secret, {
      expiresIn: '30d',
      algorithm: 'HS256',
    });
    return token;
  },
  decryptToken: token => {
    const decrypted = jwtDecode(token);
    const iat = new Date(decrypted.iat * 1000);
    const exp = new Date(iat.getTime() + 30 * 60000);
    return {
      iat: iat,
      exp: exp,
    };
  },
  comparePassword: (plainPassword, hashedPassword) => bcryptjs.compareSync(plainPassword, hashedPassword),

  generateRandomToken: (length = 6) => {
    if (length < 3) {
      throw new Error('Token length must be at least 2.');
    }

    const randomDigits = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 10));
    randomDigits[0] = Math.floor(Math.random() * 9) + 1;
    randomDigits.push(Math.floor(Math.random() * 9) + 1);
    randomDigits.sort(() => Math.random() - 0.5);
    const token = randomDigits.join('');

    return token;
  },
  filterQuery: req => ({
    ...req.query,
    page: req.query.page ? Number(req.query.page) : 1,
    itemsPerPage: req.query.itemPerPage
      ? Number(req.query.itemPerPage)
      : req.query.perPage
      ? Number(req.query.perPage)
      : 10,
    searchText:
      req.query.searchText !== 'null' && req.query.searchText !== 'undefined' && req.query.searchText
        ? req.query.searchText
        : '',
    startDate:
      req.query.startDate !== 'null' && req.query.startDate !== 'undefined' && req.query.startDate
        ? req.query.startDate
        : '',
    endDate:
      req.query.endDate !== 'null' && req.query.endDate !== 'undefined' && req.query.endDate ? req.query.endDate : '',
  }),
  pagination: (items = [], page = 1, totalItems = 0, itemsPerPage = 5) => {
    return {
      currentPage: page,
      hasNextPage: itemsPerPage * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage),
      totalItems: totalItems,
      items: items,
    };
  },
  sendEmailLocally: ({ template, to, subject, attachment = null }) => {
    try {
      let transporter = nodemailer.createTransport({
        host: mail_host,
        port: mail_port,
        secure: false,
        auth: {
          user: mail_username,
          pass: mail_password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      transporter.sendMail({
        from: `${mail_from_name} <${mail_from_address}>`,
        to: to,
        replyTo: null,
        subject,
        html: template,
        attachments: attachment,
      });
    } catch (error) {
      throw new Error(`${error.message}:400`);
    }
  },
  pushNotification: async ({ title, body, token }) => {
    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        android: {
          priority: "high",
          notification: {
            channelId: "default-channel-id", // Ensure you have a valid notification channel in AndroidManifest.xml
            sound: "default",
            priority: "high",
            visibility: "public",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
        data: {
          title: title,
          body: body,
          customData: "Your custom data here", // Ensure the data field is present for background notifications
        },
        token: token,
      };
  
      const response = await admin.messaging().send(message);
      console.log(response, "Notification sent successfully");
      return response;
    } catch (error) {
      console.log(error, "Error sending notification");
      return error;
    }
  },  
  createCustomerInStripeWhenSignUp: async (email, name) => {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer in Stripe:', error);
      return null;
    }
  },

  checkGreaterStartAndTime: arr => {
    const problematicItem = arr.find((item, index) => {
      const start = Number(item.start.split(':')[0]);
      const end = Number(item.end.split(':')[0]);
      return start >= end;
    });

    if (problematicItem) {
      const index = arr.indexOf(problematicItem);
      return {
        success: false,
        message: `Start time at position ${index} is greater than or equal to end time`,
      };
    } else {
      return { success: true };
    }
  },

  areArraysEqual: (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }

    const copyArray1 = [...array1];
    const copyArray2 = [...array2];

    copyArray1.sort((a, b) => (JSON.stringify(a) > JSON.stringify(b) ? 1 : -1));
    copyArray2.sort((a, b) => (JSON.stringify(a) > JSON.stringify(b) ? 1 : -1));

    for (let i = 0; i < copyArray1.length; i++) {
      const obj1 = copyArray1[i];
      const obj2 = copyArray2[i];

      if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
        return false;
      }
    }

    return true;
  },
  sendEmail: async ({ template, toList, subject }) => {
    try {
      const msg = {
        to: toList,
        from: sendgrid_email_from,
        subject: subject,
        html: template,
        host: sendgrid_host,
        port: sendgrid_port,
        auth: {
          user: sendgrid_user_name,
          pass: sendgrid_api_key,
        },
      };
      await sgMail.send(msg);
      return { success: true, message: 'Email Sent Successfully!', code: 200 };
    } catch (err) {
      console.log("oijoihjjuihhuihih",err.response.body.errors);
      let msg = null;
      if (err.response && err.response.body && err.response.body.errors) {
        const msg = err.response.body.errors.map(error => error.message).join('; ');
        return { success: false, message: msg, code: 500 };
      } else if (err.code === 'EACCES' || err.code === 'EAUTH') {
        msg = 'Email sending failed: Permission denied or wrong credentials';
        return { success: false, message: msg, code: 401 };
      } else {
        msg = 'Email sending failed: Something went wrong';
        return { success: false, message: msg, code: 500 };
      }
    }
  },
};
