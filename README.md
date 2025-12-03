# Tour Management App

A simple **Tour Management** application built with **Node.js**, **Express**, and **MongoDB**.  
This app allows you to **create, read, update, and delete (CRUD)** tours.
---


# Script
comment all the validation before importing
- npm run import:all - to import all tours from `tours-simple.json`
- npm run delte:all - to delete all tours from DB

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Create a new tour
- Get a list of all tours
- Get a single tour by ID
- Update a tour
- Delete a tour

---

## Technologies

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **Nodemon** – Development utility for auto-reloading

---

## Installation

- Clone the repository.
- Install dependencies with `npm install`.
- Copy `.env.example` to `config.env` and fill in your credentials.
- Start the development server with `npm run start`.

---

## Environment Configuration

Use `.env.example` as a template for configuring environment variables. The defaults use Mailtrap for email testing and leave secrets blank so you can supply your own values.

implement restriction 