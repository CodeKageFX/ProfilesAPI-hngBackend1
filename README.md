# Profiles API

## Overview
This project gives you a simple way to create and manage detailed profiles for people just by providing their name. It takes a name, automatically fetches demographic information like probable gender, age, and nationality, and then stores it. It's super handy for quickly enriching basic name data with deeper insights without any manual research.

## Features
-   **Create Profiles**: Automatically generate comprehensive profiles from a given name, including inferred gender, age, and top probable nationality.
-   **Retrieve All Profiles**: Get a list of all stored profiles, with options to filter by gender, age group, or country.
-   **Get Single Profile**: Fetch a specific profile using its unique ID.
-   **Delete Profile**: Remove a profile from the system by its ID.
-   **Data Enrichment**: Integrates with external APIs to infer demographic data (gender, age, nationality) for names.

## Getting Started
To get this API up and running on your local machine, follow these steps.

### Installation
First, clone the repository to your local machine:
```bash
git clone git@github.com:CodeKageFX/ProfilesAPI-hngBackend1.git
cd ProfilesAPI-hngBackend1
```

Next, install all the project dependencies:
```bash
npm install
```

Set up your database. This project uses Prisma and defaults to SQLite for local development.
```bash
npx prisma migrate dev --name init
```
This command will create a `dev.db` file in the `prisma` directory and apply the schema.

Finally, build the TypeScript project:
```bash
npm run build
```

### Environment Variables
You'll need a `.env` file in the root of your project to manage environment variables. Create a file named `.env` and add the following:

-   `DATABASE_URL`: Your database connection string.
    *   For local SQLite development, you can use: `DATABASE_URL="file:./prisma/dev.db"`
    *   If you want to connect to a PostgreSQL database (like the one used in `.env.local`), it would look something like:
        `DATABASE_URL="postgresql://neondb_owner:npg_-shy-dew-alwafot7-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"`

## Usage
Once you've installed everything and configured your environment variables, you can start the API server.

For development with automatic restarts on file changes:
```bash
npm run dev
```

For production, or to run the compiled JavaScript:
```bash
npm start
```

The server will typically run on `http://localhost:3000`.

## API Documentation
This API provides several endpoints to manage profiles.

### Base URL
`http://localhost:3000`

### Endpoints

#### `GET /`
A simple health check to ensure the server is active.
**Description**: Returns a message confirming the server is running.

**Request**:
`GET /` (No body required)

**Response**:
```json
{
  "message": "Server Active!"
}
```

#### `POST /profile`
**Description**: Creates a new profile by taking a name, inferring gender, age, and nationality using external APIs, and saving the data. If a profile for the given name already exists, it returns the existing profile.

**Request**:
```json
{
  "name": "John"
}
```

**Response (New Profile Created)**:
```json
{
  "status": "success",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 123456,
    "age": 45,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**Response (Profile Already Exists)**:
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 123456,
    "age": 45,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**Errors**:
-   `400`: If the `name` is empty, too long, or not a string.
-   `502`: If external API data (nationality, age, or gender) isn't available for the given name.
-   `500`: General server error if profile creation fails for other reasons.

#### `GET /profile`
**Description**: Retrieves a list of all profiles. You can filter the results using query parameters.

**Request**:
`GET /profile` (No query parameters)

`GET /profile?gender=male&age_group=adult&country_id=US` (With query parameters)

**Response**:
```json
{
  "status": "success",
  "