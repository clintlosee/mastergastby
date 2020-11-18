const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `<div>
    <h2>Your Recent order for ${total}</h2>
    <p>Please start walking over, we will have your order ready in the next 20 mins.</p>
    <ul>
    ${order
      .map(
        (item) => `<li>
      <img src="${item.thumbnail}" alt="${item.name}"/>
      ${item.size} ${item.name} - ${item.price}
    </li>`
      )
      .join('')}
    </ul>
    <p>Your total is <strong>${total}</strong> due at pickup.</p>
    <style>
      ul {
        list-style: none;
      }
    </style>
  </div>`;
}

// create a transport for nodemailer
const transporter = nodemailer.createTransport({
  // auth variables (user postmark, sendgrid, ethereal.email etc)
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  // await wait(5000);

  const body = JSON.parse(event.body);

  //* Check if they filled out the honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Boop beep bop zzz, goodbye! ERR 4488' }),
    };
  }

  // validate the data coming in is correct
  const requiredFields = ['name', 'email', 'order'];

  for (const field of requiredFields) {
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! Your are missing the ${field} field`,
        }),
      };
    }
  }

  //* Make sure they actually have items in that order
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Why would you order nothing?!`,
      }),
    };
  }

  // send the email
  // Test send an email
  const info = await transporter.sendMail({
    from: "Slick's Slices <slick@example.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: 'New Order!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });

  // send the success or error message

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
