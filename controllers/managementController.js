const exampleService = require('../services/exampleService');

const getExample = async (req, res) => {
  try {
    const result = await exampleService.fetchExampleData();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExample,
};
