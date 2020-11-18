//* Netlify serverless function
exports.handler = async (event, context) => ({
  statusCode: 200,
  body: 'Hello!',
});

//* Vercel serverless function
// module.exports = async (req, res) => ({
//   statusCode: 200,
//   body: 'Hello from Vercel!',
// });
