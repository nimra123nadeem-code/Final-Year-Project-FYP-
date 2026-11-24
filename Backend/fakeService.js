const mongoose = require('mongoose');
const faker = require('faker');
const { SERVICE } = require('./models'); // Import your service model
const { mongo_string } = require('./configs');

mongoose.connect(mongo_string, { useNewUrlParser: true, useUnifiedTopology: true });

// Define your schemas and models here

const generateSubCategory = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  price: faker.commerce.price(),
});

const generatePriceList = () => ({
  title: faker.commerce.department(),
  subCategory: [generateSubCategory()],
});

const generateServiceDetails = () => ({
  title: faker.lorem.words(),
  description: faker.lorem.paragraph(),
  icon: faker.image.imageUrl(),
});

const generateService = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  image: faker.image.imageUrl(),
  tags: [faker.lorem.word(), faker.lorem.word()],
  priceList: [generatePriceList()],
  serviceDetails: [generateServiceDetails()],
});

async function insertFakeData() {
  try {
    const numRecords = 10; // Change this to the number of records you want to generate

    for (let i = 0; i < numRecords; i++) {
      const fakeService = generateService();
      await SERVICE.create(fakeService);
      console.log(`Inserted fake record ${i + 1}`);
    }

    console.log('Fake data insertion complete');
  } catch (error) {
    console.error('Error inserting fake data:', error);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = insertFakeData();
