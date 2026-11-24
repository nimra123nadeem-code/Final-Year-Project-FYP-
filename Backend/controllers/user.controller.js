const { serviceController } = require('.');
const { USER, USER_JWT, SERVICE, ORDER } = require('../models'); // Import the User model
const {
  hashPassword,
  decryptToken,
  generateToken,
  comparePassword,
  sendEmailLocally,
  pushNotification,
  createCustomerInStripeWhenSignUp,
  generateRandomToken,
  sendEmail,
} = require('../utils/helper');
const sentResetToken = require('../utils/templates/sentResetToken');
const { createService } = require('./service.controller');

exports.signUp = async (req, res) => {
  const { password, email, ...rest } = req.body;

  let user = await USER.findOne({ email });
  if (user) {
    throw new Error('User with this email already exists:409');
  }
  const hashedPassword = hashPassword(password);

  const stripeCustomer = await createCustomerInStripeWhenSignUp(email, rest.first_name + ' ' + rest.last_name);

  const payload = {
    email,
    password: hashedPassword,
    ...rest,
  };
  if (stripeCustomer) {
    payload.stripe_customer_id = stripeCustomer.id;
  }
  await USER.create(payload);

  return res.status(201).json({ success: true, message: 'SignUp Sucessfully!' });
};

exports.login = async (req, res) => {
  const { email, password, fcm_token } = req.body;
  let user = await USER.findOne({ email }).select('-__v');
  // const list = require('../utils/data/servicesList');

  // for (const ele of list) {
  //   await SERVICE.create({ ...ele });
  // }  
  if (!user || !comparePassword(password, user.password)) {
    throw new Error('Email or Password is Incorrect:401');
  }

  const totalSessions = await USER_JWT.countDocuments({
    user_id: user._id,
  });

  if (totalSessions > 0) {
    await USER_JWT.findOneAndRemove({ user_id: user._id });
  }
   //createService();
  const token = generateToken({
    id: user._id,
    email,
  });
  let orders = await ORDER.find({ user_id: user._id });



  if (!token) {
    throw new Error('Error generating token!:500');
  }

  const decryptedToken = decryptToken(token);

  await USER_JWT.create({
    user_id: user._id,
    token: token,
    iat: decryptedToken.iat,
    exp: decryptedToken.exp,
  });

  if (fcm_token) {
    user.fcm_token = fcm_token;
    await user.save();
  }

  user.password = undefined;

  return res.status(200).send({
    code: 200,
    success: true,
    message: 'Login successful!',
    token,
    user,
    orderLength: orders?.length
  });
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log('Received id:', id);

  try {
    await USER.findByIdAndDelete(id);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).send({
      code: 500,
      success: false,
      error: 'Internal Server Error',
    });
  }

  return res.status(200).send({
    code: 200,
    success: true,
    data: 'Deleted',
  });
};

exports.logout = async (req, res) => {
  const { id } = req.params;

  await USER_JWT.findOneAndRemove({
    user_id: id,
  });

  return res.status(200).send({
    code: 200,
    success: true,
    message: 'Logout successful!',
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await USER.findOne({ email });
  if (!user) {
    throw new Error('User not found:404');
  }

  let resetToken = generateRandomToken();

  user.reset_token = resetToken;
  user.reset_token_expiration = Date.now() + 120 * 60 * 1000; // Token valid for 1 hour
  await user.save();

  if (process.env.NODE_ENV === 'live') {
    sendEmailLocally({
      to: user.email,
      subject: 'Password Reset',
      template: sentResetToken({ resetCode: resetToken, companyName: 'Launder Remedy' }),
    });
    return res.status(200).json({ success: true, message: 'Password reset instructions sent' });
  } else {
    const result = await sendEmail({
      toList: user.email,
      subject: 'Password Reset',
      template: sentResetToken({ resetCode: resetToken, companyName: 'Launder Remedy' }),
    });

    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      throw new Error(`${result.message}:${result.code}`);
    }
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;

  const { newPassword } = req.body;

  const user = await USER.findOne({
    reset_token: token,
    reset_token_expiration: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token:400');
  }

  const hashedPassword = hashPassword(newPassword);

  user.password = hashedPassword;
  user.reset_token = undefined;
  user.reset_token_expiration = undefined;
  await user.save();
  return res.status(200).json({ success: true, message: 'Password reset, login with new password' });
};

exports.updateFcmToken = async (req, res) => {
  const { id, token } = req.body;

  if (!id || !token) {
    throw new Error('Payload is bad:400');
  }

  const user = await USER.findByIdAndUpdate(
    id,
    {
      $set: { fcm_token: token },
    },
    { new: true },
  );

  return res.status(200).json({ success: true, message: 'FCM Token Updated', data: user });
};

exports.sendPushNotification = async (req, res) => {
  const { title, body, user_id } = req.body;

  const user = await USER.findById(user_id);

  if (!user.fcm_token) {
    throw new Error('Error while sending Notification!:500');
  }

  const response = await pushNotification({ title, body, token: user.fcm_token });

  if (response) {
    return res.status(200).json({ success: true, message: 'Notification Sent' });
  }
};

exports.isEmailTaken = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  const user = await USER.findOne({ email });

  if (!user) {
    return res.status(200).json({ success: false, message: 'Not taken' });
  }

  return res.status(200).json({ success: true, message: 'Email is Taken', data: user });
};

exports.isPhoneTaken = async (req, res) => {
  let { phone } = req.body;

  const user = await USER.findOne({ phone_number: phone });

  if (!user) {
    return res.status(200).json({ success: false, message: 'Not taken' });
  }

  return res.status(200).json({ success: true, message: 'Phone is Taken', data: user });
};

exports.addUserAddress = async (req, res) => {
  let { _id } = req.user;

  await USER.findByIdAndUpdate(_id, { $set: { address: req.body } });

  return res.status(200).json({ success: true, message: 'Address Added SuccessFully!' });
};


exports.editUserProfile = async (req, res) => {
  let { _id } = req.user;
  let { email } = req.body;
  await USER.findByIdAndUpdate(_id, { $set: { ...req.body } });
  const user = await USER.findOne({ email });
  return res.status(200).json({ success: true, data: user, message: 'Profile Updated SuccessFully!' });
};

