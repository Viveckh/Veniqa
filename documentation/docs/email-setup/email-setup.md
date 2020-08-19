# Email Settings

The default email service provider that Veniqa supports out-of-the-box is [Sendgrid](https://sendgrid.com). Although you will also find a partial example implementation of [Nodemailer](https://nodemailer.com) in our codebase, this was dropped for a more robust alternative that can be used in production. We left the code in as an example to use an alternative email service provider.

## Using Sendgrid
* Sign up for an account at [Sendgrid](https://sendgrid.com) and get an API key. Sendgrid does offer a free tier, so that should get the job done for light usage.
* Use the API key in the server .env files as the value for `VENIQA_SENDGRID_API_KEY`. This needs to be done both on the shopping server and the management server.
* Login to Sendgrid's website and create dynamic templates for various email purposes (email confirmation, password reset, etc). We provide our own dynamic templates for quickstart, which is available on the `/setup-resources/sendgrid_email_templates/` folder. Feel free to customize to fit your styling needs.
* Every dynamic template you create on your sendgrid account is given a unique `Template ID`. Note down these template ids from the sendgrid website.
* Input these template IDs in the `sendgrid` node of the configuration jsons located at `config/default.json` and `config/production.json` on both the shopping and management servers.

## Using a Different Email Service

While we love Sengrid, you are free to implement an email service using the provider of your choosing. In order to do this, follow the following high level steps. 

**Note:** You can see an example of such an implementation by looking at the partial implementation of using the [Nodemailer service](https://nodemailer.com), which is available at `management-server/services/emailService.js` and `shopping-server/services/emailService.js`

* Make a copy of the files `management-server/services/emailServiceSendgrid.js` and `shopping-server/services/emailServiceSendgrid.js`. 
* Make updates to the functions in the file depending on the API documentation of the email service provider you choose to use.
* If you need additional configuration values to configure this service, feel free to add new entries to the server `.env` files and the config jsons available at `/management-server/config/` and `/shopping-server/config/`. Upon addition of such new key-value pairs, they will be available to reference in your new service.
* Update references to `emailServiceSendgrid.js` within the codebase.

