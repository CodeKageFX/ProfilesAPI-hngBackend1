# Profiles API

## Overview

This project gives you a simple way to create and manage detailed profiles for people just by providing their name. It takes a name, automatically fetches demographic information like probable gender, age, and nationality, and then stores it. It's super handy for quickly enriching basic name data with deeper insights without any manual research.

## Features

- **Create Profiles**: Automatically generate comprehensive profiles from a given name, including inferred gender, age, and top probable nationality.
- **Retrieve All Profiles**: Get a list of all stored profiles, with options to filter by gender, age group, or country.
- **Get Single Profile**: Fetch a specific profile using its unique ID.
- **Delete Profile**: Remove a profile from the system by its ID.
- **Data Enrichment**: Integrates with external APIs to infer demographic data (gender, age, nationality) for names.

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

- `DATABASE_URL`: Your database connection string.
  - For local SQLite development, you can use: `DATABASE_URL="file:./prisma/dev.db"`
  - If you want to connect to a PostgreSQL database (like the one used in `.env.local`), it would look something like:
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

- `400`: If the `name` is empty, too long, or not a string.
- `502`: If external API data (nationality, age, or gender) isn't available for the given name.
- `500`: General server error if profile creation fails for other reasons.

#### `GET /profile`

**Description**: Retrieves a list of all profiles. You can filter the results using query parameters or natural language queries.

**Request**:
`GET /profile` (No query parameters)

`GET /profile?gender=male&age_group=adult&country_id=US` (With query parameters)

**Response**:

```json
{
  "status": "success",
  "
```
  "page": 1,
  "limit": 10,
  "total": 42,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "john",
      "gender": "male",
      "gender_probability": 0.99,
      "sample_size": 123456,
      "age": 45,
      "age_group": "adult",
      "country_id": "US",
      "country_name": "US",
      "country_probability": 0.85
    }
  ]
}
```

**Query Parameters**:
- `gender`: Filter by gender (`male`, `female`)
- `age_group`: Filter by age group (`child`, `teenager`, `adult`, `senior`)
- `country_id`: Filter by country ISO code (e.g., `US`, `NG`, `GB`)
- `min_age`: Minimum age (inclusive)
- `max_age`: Maximum age (inclusive)
- `min_gender_probability`: Minimum gender probability (0-1)
- `min_country_probability`: Minimum country probability (0-1)
- `sort_by`: Sort field (`age`, `created_at`, `gender_probability`, `country_probability`). Defaults to `created_at`
- `order`: Sort order (`asc` or `desc`). Defaults to `desc`
- `page`: Page number for pagination. Defaults to `1`
- `limit`: Results per page (max 50). Defaults to `10`

**Errors**:
- `500`: If there's an error retrieving profiles

---

## Natural Language Parsing

The API includes a natural language query parser that converts human-readable filter descriptions into structured query parameters. This allows for more intuitive filtering without requiring knowledge of exact parameter names.

### Supported Keywords and Mappings

The parser processes queries in a case-insensitive manner and recognizes the following patterns:

#### Gender Filters
- **Keywords**: `male`, `males`, `female`, `females`
- **Mapping**: Directly maps to the `gender` parameter
- **Examples**:
  - Input: `"show me males"` → `{ gender: "male" }`
  - Input: `"female profiles"` → `{ gender: "female" }`

#### Age Group Filters
- **Keywords**: `adult`, `adults`, `teenager`, `teenagers`, `young`
- **Mapping**: 
  - `adult`, `adults` → `{ age_group: "adult" }`
  - `teenager`, `teenagers` → `{ age_group: "teenager" }`
  - `young` → `{ min_age: 16, max_age: 24 }` (young age bracket)
- **Examples**:
  - Input: `"young adults"` → `{ min_age: 16, max_age: 24, age_group: "adult" }`
  - Input: `"teenagers in the system"` → `{ age_group: "teenager" }`

#### Age Range Filters
- **Keywords**: `above <number>`, `under <number>`
- **Mapping**: 
  - `above N` → `{ min_age: N }`
  - `under N` → `{ max_age: N }`
- **Examples**:
  - Input: `"profiles above 30"` → `{ min_age: 30 }`
  - Input: `"people under 18"` → `{ max_age: 18 }`
  - Input: `"adults above 25 and under 60"` → `{ min_age: 25, max_age: 60, age_group: "adult" }`

#### Country Filters
- **Keywords**: Country names from the supported lookup table
- **Current Countries**: `nigeria`, `angola`, `kenya`
- **Mapping**: Maps country name to ISO 2-letter country code
- **Examples**:
  - Input: `"profiles from nigeria"` → `{ country_id: "NG" }`
  - Input: `"kenya males"` → `{ country_id: "KE", gender: "male" }`

### How the Parser Works

1. **Normalization**: The input query is converted to lowercase for case-insensitive matching
2. **Pattern Matching**: Regular expressions and simple string matching identify keywords and values
3. **Filter Construction**: Recognized patterns are converted into a filters object
4. **Validation**: Returns the filters object if any filters were found, otherwise returns `null`
5. **Combination**: Multiple filter types can be combined in a single query (e.g., "young female from nigeria")

**Example Parsing Flow**:
```
Input: "show me young female profiles from nigeria"
↓
Normalize: "show me young female profiles from nigeria"
↓
Pattern Matching:
  - Finds "young" → sets min_age: 16, max_age: 24
  - Finds "female" → sets gender: "female"
  - Finds "nigeria" → sets country_id: "NG"
↓
Output: {
  min_age: 16,
  max_age: 24,
  gender: "female",
  country_id: "NG"
}
```

---

## Limitations and Edge Cases

### Parser Limitations

#### 1. **Limited Country Coverage**
- **Limitation**: Only three countries are currently supported: Nigeria (`NG`), Angola (`AO`), and Kenya (`KE`)
- **Workaround**: Use the standard `country_id` query parameter with ISO codes for other countries
- **Impact**: Queries like "profiles from germany" won't be parsed; use `?country_id=DE` instead

#### 2. **No Complex Boolean Logic**
- **Limitation**: The parser doesn't support `OR`, `AND`, or negation operators
- **What doesn't work**: "males or females", "not young", "adults AND from kenya"
- **Workaround**: Make separate requests or use multiple query parameters directly
- **Impact**: Complex queries may be partially parsed or ignored

#### 3. **Order of Keywords Doesn't Matter, But Conflicts Can**
- **Limitation**: If contradictory keywords appear (e.g., "males females"), the last match wins
- **What doesn't work**: "profiles that are both adult and teenage"
- **Workaround**: Use separate API calls for mutually exclusive filters
- **Example**: 
  - Input: `"male female"` → `{ gender: "female" }` (female overwrites male)

#### 4. **Age Range Precision**
- **Limitation**: "Young" is hardcoded to ages 16-24. This can't be customized via natural language
- **Workaround**: Use `min_age` and `max_age` query parameters directly
- **What doesn't work**: Parsing "young" as ages 18-30 or any other custom range

#### 5. **No Fuzzy Matching for Countries**
- **Limitation**: Exact substring matching is required; "nigerian" won't match "nigeria"
- **Workaround**: Use exact country names or the ISO code parameter
- **Examples of what fails**:
  - Input: `"nigerian males"` → won't parse `country_id: "NG"` (would need "nigeria")
  - Input: `"usa profiles"` → won't parse (not in lookup table; use `?country_id=US`)

#### 6. **Probability Filters Not Supported**
- **Limitation**: Natural language parser doesn't recognize minimum probability thresholds
- **What doesn't work**: "highly confident males", "profiles with 80% country probability"
- **Workaround**: Use `min_gender_probability` and `min_country_probability` query parameters directly

#### 7. **Sorting and Pagination Keywords Not Recognized**
- **Limitation**: The parser doesn't recognize natural language for sorting or pagination
- **What doesn't work**: "sort by age ascending", "get 25 per page", "show page 3"
- **Workaround**: Use `sort_by`, `order`, `limit`, and `page` query parameters

#### 8. **No Multi-word Context Awareness**
- **Limitation**: Keywords are matched in isolation; context is ignored beyond simple patterns
- **Examples**:
  - Input: `"male above 30 and under 50"` → Works, but only because regex matches "above 30" and "under 50"
  - Input: `"profiles aged between 25 and 35"` → "between" is not recognized; won't parse age range
  - Workaround: Use `min_age=25&max_age=35` parameters

### Data and API Limitations

#### 1. **External API Dependencies**
- **Limitation**: Profile creation depends on three external APIs (Genderize.io, Agify.io, Nationalize.io)
- **Failure Mode**: If any API returns invalid data, the profile creation fails with a 502 error
- **Impact**: Some names may fail to create profiles if they're not in the external databases
- **Workaround**: None; these are external service limitations

#### 2. **Age Groups Are Fixed**
- **Age Groups**: Child (≤12), Teenager (13-19), Adult (20-59), Senior (60+)
- **Limitation**: Age group calculation is hardcoded and can't be customized
- **Impact**: No way to query for age groups like "young adults (20-35)" separately

#### 3. **Top Country Only**
- **Limitation**: Only the most probable nationality is stored; alternative nationalities are discarded
- **Impact**: Can't query profiles where a person has multiple strong nationality probabilities
- **Workaround**: None; design choice

#### 4. **Name Normalization**
- **Limitation**: Names are stored in lowercase only
- **Impact**: Case-sensitive name searches aren't possible
- **Workaround**: All searches are case-insensitive by design

#### 5. **Pagination Cap**
- **Limitation**: Maximum limit per page is 50 records
- **Impact**: Can't retrieve more than 50 profiles in a single request
- **Workaround**: Use pagination with `page` parameter to fetch multiple batches

#### 6. **Profile Uniqueness by Name**
- **Limitation**: Only one profile per unique name is allowed
- **Impact**: If two different people share the same name, only the first is stored
- **Workaround**: None; would require changing the data model

### Query Parser Edge Cases

#### 1. **Empty or Null Queries**
- **Input**: `""` or `null`
- **Behavior**: Returns `null` (no filters applied)
- **Impact**: No filtering occurs; all profiles returned

#### 2. **Single Keywords Without Context**
- **Input**: `"25"` (just a number)
- **Behavior**: Not recognized as a valid filter; ignored
- **Impact**: Query must include "above" or "under" with the number

#### 3. **Partial Matches**
- **Input**: `"fem"` (partial country/gender name)
- **Behavior**: May match `female` (regex word boundary) but won't match partial country names
- **Example**:
  - `"fem profiles"` → `{ gender: "female" }` ✓
  - `"nige profiles"` → No country filter (needs exact "nigeria") ✗

#### 4. **Multiple Age Range Filters**
- **Input**: `"above 30 under 25"`
- **Behavior**: Both filters are applied (`min_age: 30, max_age: 25`)
- **Impact**: Results in impossible filter (no one can be both above 30 AND under 25); returns empty results
- **Workaround**: Ensure age ranges are logical

#### 5. **Whitespace and Special Characters**
- **Input**: `"  male    female  "` (extra spaces)
- **Behavior**: Handled correctly by `.toLowerCase()` and regex patterns
- **Impact**: None; whitespace is normalized

#### 6. **Numbers in Edge Cases**
- **Input**: `"above-30"` (hyphen instead of space)
- **Behavior**: Won't match the regex `/above (\d+)/` (requires space)
- **Impact**: Age range not parsed; use `"above 30"` with space

---

## Future Improvements

To address these limitations, future versions could include:

- **Expanded Country Database**: Add all 250+ ISO country codes to the lookup table
- **Fuzzy Matching**: Implement fuzzy string matching for country names (e.g., match "germany" to "DE")
- **Advanced NLP**: Use a proper NLP library to handle complex queries and context
- **Probability Filtering**: Add natural language keywords for confidence thresholds (e.g., "high confidence", "very likely")
- **Sorting/Pagination Keywords**: Recognize ordering and pagination directives in natural language
- **Custom Age Groups**: Allow defining custom age ranges via parameters
- **Multiple Nationalities**: Store and query multiple probable nationalities
- **Negation Support**: Handle queries like "profiles that are NOT from USA"
- **Better Error Messages**: Return suggestions when unrecognized keywords are detected
