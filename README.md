# Dating App

A full-stack dating application built with .NET 7 and Angular 16. Users can register an account, message other users, and manage roles. The messaging feature utilizes SignalR for real-time updates, and the application is backed by a PostgreSQL database. Additionally, the app is Dockerized for easy deployment.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
  
## Introduction

Dating App is a comprehensive platform built with .NET 7 and Angular 16, offering users a seamless experience for connecting with others, messaging, and managing roles. The application leverages SignalR for real-time communication and PostgreSQL for data storage. Additionally, Dating App integrates with Cloudinary for efficient photo storage and retrieval, enhancing user experience while reducing database load.

## Features

- **User Registration**: Users can create an account with a unique username and password.
- **Messaging System**: Users can send messages to other users, with real-time updates facilitated by SignalR.
- **Role Management**: Administrators can manage user roles, granting or revoking permissions as needed.
- **PostgreSQL Database**: The application is backed by a PostgreSQL database, ensuring data integrity and reliability.
- **Dockerized Deployment**: The app includes Docker configuration files, simplifying deployment and scaling.

## Technologies Used

- **Frontend**: Angular 16
- **Backend**: .NET 7
- **Database**: PostgreSQL
- **Real-Time Communication**: SignalR
- **Containerization**: Docker

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ricudo/DatingApp.git

2. Navigate to the API directory:

   ```bash
   cd DatingApp/API

3. Configure appsettings.json for your production environment, should have next inside:

   ```bash
   {
    "CloudinarySettings": {
      "CloudName": YOUR_CLOUD_NAME,
      "ApiKey": YOUR_API_KEY,
      "ApiSecret": YOUR_API_SECRET
    },
    "ConnectionStrings": {
      "DefaultConnection": YOUR_CONNECTION_SETUP
    },
    "TokenKey": YOUR_TOCKEN_KEY
  }

4. Build the docker container(install docker first if it is not installed):

   ```bash
   docker build -t [YOUR_CONTAINER_NAME] .

5. Push the docker container:

   ```bash
   docker push [YOUR_CONTAINER_NAME]:latest

6. Run postgres container:

   ```bash
   docker run --name [NAME] -e POSTGRES_PASSWORD=[YOUR_PASSWORD] -d -p [YOUR_PORTS] postgres:latest
   
7. Run the app container:

   ```bash
   docker run --name [NAME] -d -p 80:5000 -p 443:5001 [YOUR_CONTAINER_NAME]:latest
   
## Usage

1. Register a new account.
2. Log in with your credentials.
3. Explore other users and their profiles.
4. Send messages to other users and engage in conversations.
5. Administrators can manage user roles.
