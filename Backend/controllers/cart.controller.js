const { PRODUCT,CART, DEAL, SUB_SERVICE } = require('../models');


exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing productId or quantity' });
    }

    const product = await PRODUCT.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cartItem = await CART.create({
      product,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: 'Product added to cart',
      data: cartItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getAllCart = async (req, res) => {
  
  const cart = await CART.find();

  return res.status(200).json({
    code: 200,
    data: cart,
  });
};

//!TODO will delete this
