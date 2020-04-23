# BeTheHope API
#### Backend server for BeTheHope hosted at [https://bethehope.herokuapp.com/][https://bethehope.herokuapp.com/]
#### API Documentation published on [Postman][https://documenter.getpostman.com/view/1085264/Szf9W792?version=latest]
---

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) (atleast v12.13.0, npm v6.12.0) installed.

```sh
git clone git@github.com:bethehope/bethehope-api.git
cd bethehope-api
npm install
npm run start
```
[https://bethehope.herokuapp.com/]: https://bethehope.herokuapp.com/ "https://bethehope.herokuapp.com/"

## Environment Variables
Add a `.env` file in the root folder (you should setup your MongoDb, Stripe, Firebase and Twilio accounts):
```
NODE_ENV=development
PORT=8000
CLIENT_QRDONATE_URL=http://bth.fund/

MONGODB_URI=

STRIPE_SECRET_KEY=

FIREBASE_ROOT_USER_EMAIL=
FIREBASE_ROOT_USER_PASSWORD=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_DATABASE_URL=
SENDGRID_API_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
TWILIO_PHONE_NUMBER=

BETHEHOPE_API_SECRET=
```

## Deployment
Heroku pipeline is set to auto deploy `master` branch currently.

## Integrations
- **Stripe** for collecting payments
- **Firebase** for authentication and cloud storage
- **Twilio** to send texts and WhatsApp
- **SendGrid** to send out emails



[https://documenter.getpostman.com/view/1085264/Szf9W792?version=latest]: https://documenter.getpostman.com/view/1085264/Szf9W792?version=latest "Postman"
