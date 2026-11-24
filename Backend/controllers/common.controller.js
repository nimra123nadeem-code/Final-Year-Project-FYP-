const { APP_VERSION } = require('../models');

exports.getAppVersion = async (req, res) => {
  const version = await APP_VERSION.findOne();
  console.log(version, 'versionversionversionversion');
  return res.status(200).send({ code: 200, data: version });

};
