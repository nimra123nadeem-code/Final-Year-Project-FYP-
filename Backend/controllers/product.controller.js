const { PRODUCT, DEAL, SUB_SERVICE } = require('../models');

exports.createProduct = async (req, res) => {
  const { name } = req.body;

  if (!name) throw new Error('payload is incomplete:400');

  const product = await PRODUCT.findOne({ name });

  if (product) throw new Error('Product with this name is present already.:409');

  const createdProduct = await PRODUCT.create({ ...req.body });

  return res.status(200).send({
    code: 200,
    success: true,
    data: 'Product Created',
  }); 
};

// exports.createService = async (req, res) => {
 
//     const createdService = await SUB_SERVICE.create({ ...ele });
   

//   return res.status(200).json({ code: 200, message: 'Service Created' });
// };

exports.getAllProducts = async (req, res) => {
  



  const products = await PRODUCT.find();

  return res.status(200).json({
    code: 200,
    data: products,
  });
};

// exports.getAllServices = async (req, res) => {
//   const services = require('../utils/data/servicesList');

//   return res.status(200).json({
//     code: 200,
//     data: services,
//   });
// };

exports.getService = async (req, res) => {
  const { id, title } = req.query;

  if (!id && !title) {
    throw new Error('Please provide either an ID or a title.:400');
  }

  let service;

  if (id) {
    service = await SERVICE.findById(id).select('-__v').lean();
  } else {
    service = await SERVICE.findOne({ title }).select('-__v').lean();
  }

  if (!service) {
    throw new Error('Service not found.:404');
  }

  return res.status(200).json({
    code: 200,
    data: service,
  });
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Service ID is required.' });
  }

  if (updateData.subcategories) {
    updatedService = await SERVICE.findByIdAndUpdate(
      id,
      { $set: { subcategories: updateData.subcategories } },
      { new: true },
    );
  } else {
    updatedService = await SERVICE.findByIdAndUpdate(id, updateData, { new: true });
  }

  if (!updatedService) {
    throw new Error('Service not found.:404');
  }
  return res.status(200).json({
    code: 200,
    data: updatedService,
  });
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;

  await SERVICE.findByIdAndDelete(id);

  return res.status(200).json({
    code: 200,
    message: 'Service Deleted',
  });
};

exports.createDeal = async (req, res) => {
  const { title } = req.body;

  if (!title) throw new Error('payload is incomplete:400');

  const deal = await DEAL.findOne({ title });

  if (deal) throw new Error('Deal with this title is present already.:409');

  const createdDeal = await DEAL.create({ ...req.body });

  return res.status(200).json({ code: 200, message: 'Deal Created', data: createdDeal });
};

//!TODO will delete this
