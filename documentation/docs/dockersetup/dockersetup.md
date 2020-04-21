# Docker for local development

Since there are a lot of moving pieces, starting up each web client, server together with mongo database can be challenging. These services should be running at the end of it.

- Shopping Web Application
- Shopping Server
- Admin Web Application
- Admin Server
- Redis Server
- MongoDB 

For the local development, you can utilize Docker in your local machine to do all the setup for you. Then, you can directly access the entire application locally without having to go to individual projects and setting it up.
> If you do not have Docker in your local machine, go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) to download the app.

# Project Setup

## Initiate Docker Process
> Prerequisite: You need Docker installed in your local machine and should have access to `docker-compose`

To install all the necessary components and start your suite of applications, go to **Veniqa** repo.
```
> cd <Your Path>/Veniqa
```

Then, start the setup process by running the following command:
```
> docker-compose up
```

## What is `docker-compose` doing?

`docker-compose` is creating multiple images and starting multiple containers each necessary for the application to run. These steps happen with `docker-compose`:

### Mongo Setup
   
This step creates a mongo instance in a container. It exposes port `27000` if you want to access mongo through tools like `Robo3T` or CLI.

### Redis Setup

Redis instance is also created since the application uses session caching. The exposed port is `6379`. 

### Shopping Server Setup

Shopping Server is also started in a container. It also features **hot-reloading**. So, every time you make any changes in the server code, it is automatically reflected.

Access: [http://localhost:4201](http://localhost:4201)

### Admin Server Setup

Admin Server is also started in a container. It features **hot-reloading** as well.

Access: [http://localhost:4202](http://localhost:4202)

### Shopping Web Client Setup

Shopping Web app is started in a container with **hot-reloading** enabled. 

Access: [http://localhost:5201](http://localhost:5201)

### Admin Web Client Setup

Admin Web App is started in a container with **hot-reloading** as well.

Access: [http://localhost:5202](http://localhost:5202)


## Modify the DB and Cache connections

If you want to modify the default instances of using docker's mongo and redis services, you can also provide the connection details to your own DB. To do so, you need to modify the environment variables in `docker-compose.yml` file in the root of the directory.

## Default logins

#### Shopping Platform

You can sign up as a user. 

Or duplicate an existing user in mongo `users` collection and replace the `email` and `password` field with email and password hash for the following admin user from `admins` collection.

#### Admin Platform

The following user with SUPERADMIN privilege is available as default.

**Email:** demo@veniqa.com

**Password:** pass$12

