const { stripe_secrete_key } = require('../configs');
const { USER, ORDER } = require('../models');
const stripe = require('stripe')(stripe_secrete_key);
const {
  pushNotification,
} = require('../utils/helper');
exports.processPayment = async (req, res) => {
  const { token, amount, description, id } = req.body;

  const user = await USER.findById(id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'gbp',
    description: description,
    automatic_payment_methods: {
      enabled: false,
    },
    payment_method_types: ['card'],
    customer: user?.stripe_customer_id,
    payment_method_data: {
      type: 'card',
      card: {
        token: token,
      },
    },
    confirm: true,
  });

  if (paymentIntent.status === 'succeeded') {
    user.fcm_token &&
      (await pushNotification({ title: 'Payment Created', body: 'Your order has been successfully paid. The total amount charged is £' + amount + '. Thank you for your purchase!', token: user.fcm_token }));
    res.status(200).json({ code: 200, success: true, status: paymentIntent.status });
  } else {
    res.status(200).json({ code: 200, success: true, status: 'error' });
  }
};

exports.createPaymentIntent = async (req, res) => {
  const { amount, description, payment_method_id, user_id, id, type } = req.body;
  const user = await USER.findById(user_id);

  // const paymentIntent = await stripe.paymentIntents.create({
  //   currency: 'GBP',
  //   amount: amount,
  //   confirm: true,
  //   description: description,
  //   customer: user.stripe_customer_id,
  //   payment_method: payment_method_id,
  //   automatic_payment_methods: {
  //     enabled: true,
  //     allow_redirects: 'never',
  //   },
  // });
  let paymentIntent;
  if (type == "payment") {


    paymentIntent = await stripe.paymentIntents.create({
      currency: 'GBP',
      amount: amount,
      confirm: true,
      description: description,
      customer: user.stripe_customer_id,
      payment_method_data: {
        type: 'card',
        card: {
          token: payment_method_id,
        },
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
  }

  if (paymentIntent || type == "prepaid") {
    await ORDER.findByIdAndUpdate(id, { $set: { status: 'processing', payment_done: true, payment_id: '' } });
    res.status(200).json({ code: 200, success: true, clientSecret: type == "prepaid" ? "Prepaid" : paymentIntent.client_secret });
  } else {
    res.status(500).json({ code: 500, success: false, status: 'error' });
  }
  // res.status(500).json({ code: 500, success: false, status: 'error' });
};

exports.sendConfigToClient = async (req, res) => {
  res.status(200).json({ code: 200, success: true, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY, clientSecret: process.env.STRIPE_SECRETE_KEY });
};

exports.addCardToCustomer = async (req, res) => {
  const { token, email } = req.body;
  const user = await USER.findOne({ email });
  const attachedPaymentMethod = await stripe.paymentMethods.attach(token, {
    customer: user.stripe_customer_id,
  });
  res.status(200).json({ code: 200, success: true, attachedPaymentMethod });
};

exports.getCustomersCard = async (req, res) => {
  const { id } = req.params;
  const user = await USER.findById(id);
  const cards = await stripe.paymentMethods.list({
    customer: user.stripe_customer_id,
  });
  res.status(200).json({ code: 200, success: true, cards });
};
