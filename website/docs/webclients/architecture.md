# Webclients

For the frontend UI, there are 2 web applications that bring the e-commerce platform together. They are:

1. Customer-facing web application
2. Vendor-facing web application

## Customer-facing web application

This is the main e-commerce web app that the users buy the product from. After testing out several design inspirations, we settled down to a minimalistic design that is aimed towards giving the customers the best shopping experience.

## Vendor-facing web application

This is the management web application where the vendor can manage the inventory, shipping, etc. This is very helpful for the management teams to sell their items online.

---

## Tech & Infrastructures used

- **VueJS**
  VueJS is used throughout both of the web applications.
- **Khalti Integration**
  Khalti, a Nepali payment platform, has been integrated with the application.
- **Stripe Integration**
  Stripe, an online payment API, has also been integrated with the application. You, simply, have to generate the API key and use it in the application.
- **Google Recaptcha**
  Google's Recaptcha has been used during login to make sure that the traffic is not automated for any sort of web attacks.

---

## Configuration setup

### Stripe Configuration

You generally need multiple keys to handle the Stripe integration. One is the secret key that you'd implement in the webserver whereas you need a public key that would identify the transaction in the frontend. This frontend key is public (cause duh).

Go to `shopping-webclient/src/config.json` to enter the Stripe key that you generated.

To generate the Stripe key, please follow the Stripe documentation at https://stripe.com/docs/keys#test-live-modes

### Khalti Configuration

We also have an implementation of Khalti, a Nepali online payment platform, that allows you to use Khalti payment from the e-commerce application. Similar to the Stripe integration, you need a key for Khalti integration too.

Go to `shopping-webclient/src/config.json` to enter the Khalti key.

Check out https://docs.khalti.com/checkout/web/ to learn more on Khalti.

### Google recaptcha

Getting Google's Recaptcha is one of the easiest setups you would go through. All you need to do is, again, go to `shopping-webclient/src/config.json` and enter the Google Recaptcha key for your application.

Generate your Google Recaptcha key from https://www.google.com/recaptcha/intro/v3.html.

---

## Running your application

To run your application in your local, you simply need to run
`npm run serve`

To build your application, you need to run
`npm run build`
It will build your application to HTML and js files. So, you can literally deploy it to any servers or if you prefer hassle-free deployment with scalability, you can put it in S3 bucket.

If you look into the `Dockerfile` inside the project, you can see that the application has been deployed in [http-server](https://github.com/http-party/http-server). However, HTTP-server is not the way to go for production. If you would like you can use [nginx](https://www.nginx.com/) as it comes with amazing features that can scale your application.

To find all the linting errors, run
`npm run lint`

---

## Environment Setup

All of the applications typically have 3 environment setups:

1. **Development Environment**: Generally vulnerable as there are a lot of code changes in development level
2. **QA Environment**: This is the environment for the QA to test all the features and fixes.
3. **Production Environment**: This is the environment for the customers to access. Usually, after QA approves the features, it goes into production.

Veniqa UI applications are also configured to be friendly with the build and deployment process for various environments. In the root directory, you will find `.env` files. They simply represent what environment variables to load for the different environments.

In Veniqa, we have 3:

- `.env`
- `.env.dev`
- `.env.prod`

You can put your environment variables based on which environment you want to run the variable in. For example, in Veniqa, we need `VUE_APP_API_BASE_URL` for the API calls to make. For every environment (dev/qa/prod), they would have separate API endpoints. So, you can enter this info here.

During the build, you should run `npm run build --mode=prod` if you would like to use `.env.prod` environment variables throughout the application.

To learn more about creating different types of environment variables, you can go [here](https://cli.vuejs.org/guide/mode-and-env.html#modes).
