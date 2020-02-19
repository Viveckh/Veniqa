# Servers Setup

The following are the set of infrastructures that the Veniqa platform needs to run. You will need them set up before you hop to configuring the server. We hate this part too :/ but trust us, this is a small price to pay compared to spending months to build the platform from the ground up.

* 1 MongoDB Database
    * Recommended: Try out mLab or MongoAtlas since they give out free sandboxes for up to 500MB storage which is more than enough for your prototyping
    * Alternative: You can use a local MongoDB instance for dev work
* 1 Redis Instance
    * Recommended: A local redis instance for dev work is fine
    * Alternative: AWS has some super cheap t2.micro redis instances for about $10 a month.
* 1 AWS S3 bucket with these configurations and programmatic Access Keys with full S3 access rights.
    * You can get 5G of free storage for the first year of AWS free tier. Even if you choose to pay, S3 charges are barely a few cents until you have only a few dozen product images.
* 1 SendGrid Email API Key
    * 100 emails per day available in free tier
* 1 Stripe API Key
    * No cost for set up and development, Stripe takes a certain percent of transactions only when you use it in production

---

## 1. PICK your initialization parameters

Based on the following environment variables, the server decides whether to attach debuggers, hot reloading and build optimizations, and where to look for sensitive information and other backend configurations.

So, pick what suits you best and use that in the upcoming steps.

|ENVIRONMENT VARIABLE   |VALID VALUES               |DEFAULT        
|---                    |---                        |---                         
|NODE_ENV               |development, production    |development    
|VENIQA_ENV             |aws, azure, local          |local         

---

## 2. FILL OUT the relevant configuration template(s)

There are mainly two files you have to worry about.
1. The .env.* file is where you populate your sensitive credentials like connection details, access keys, secret hash strings, and external API keys. In local runs, the server automatically reads from the .env.* file whereas in cloud environments like AWS and Azure, for security reasons, you are expected to populate these key-value pairs directly to the environment variables. Refer to this for its schema. **DO NOT COMMIT THE .ENV FILES TO YOUR VERSION CONTROL**

2. The configuration json files are prepopulated with appropriate settings for the most part. But there are a few details which you'll have to edit. Refer to this for its schema.


Depending on how you are planning on running the servers, complete the appropriate section below.

### Local Mode

* NODE_ENV=development and VENIQA_ENV=local 
    * Sensitive creds: a completed `.env.development` file which follows the format of `.env.format` file and is placed at the same directory level
    * Backend config: `config/default.json`

* NODE_ENV=production and VENIQA_ENV=local
    * Sensitive creds: a completed `.env.production` file which follows the format of `.env.format` file and is placed at the same directory level
    * Backend config: `config/production.json`

### Cloud Mode

* NODE_ENV=development and VENIQA_ENV=aws or azure
    * Sensitive creds: it is expected that you load the keys outlined in `env.format` with values to the environment variables 
    * Backend config: `config/default.json`

* NODE_ENV=production and VENIQA_ENV=aws or azure
    * Sensitive creds: it is expected that you load the keys outlined in `env.format` with values to the environment variables
    * Backend config: `config/production.json`

---

## 3. LAUNCH the server while feeding your choices from Step 1.

### Development Mode

`NODE_ENV=development VENIQA_ENV=your_choice_here npm run devstart`

### Production Mode

`NODE_ENV=production VENIQA_ENV=your_choice_here npm run start`


