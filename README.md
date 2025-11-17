# PageTracker Node.js

A lightweight Node.js API to track webpage information using Node, Express, and Playwright. This service allows you to fetch page metadata (title, description), and screenshots from multiple webpages concurrently.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/dvwhite/pagetracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browser**

```bash
npx playwright install
```

This step downloads the required browser binaries that Playwright uses to interact with webpages.

4. **Build the project**

```bash
npm run build
```

## Configuration

You can configure the application using environment variables:

- `PORT` - Server port (defaults to `3000`)
- `MAX_CONCURRENCY` - Maximum number of concurrent page requests (default is `3`)

## Running the Server

### Development Mode

```bash
npm run dev
```

Runs the server with Nodemon file watcher.

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

### Health Check

**GET** `/`

Check if the API is running.

#### Response

```json
{
    "status": "ok",
    "message": "API is up and running."
}
```

---

### Track Pages

**POST** `/track-pages`

Fetch metadata and optionally take screenshots of multiple webpages.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `urls` | `string[]` | Yes | Array of URLs to track |
| `takeScreenshots` | `boolean` | Yes | Whether to take screenshots of the webpage at url |

#### Response Body

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Overall request status (`"Success"` or `"Error"`) |
| `data` | `object[]` | Array of page data objects |
| `validation` | `string[]` | Array of validation messages |

**Page Data Objects** (contained in `data` array):

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Request status for each url (`"Success"` or `"Error"`) |
| `message` | `string` | Success or error message for the url |
| `title` | `string \| null` | The page title, or `null` if unavailable |
| `description` | `string \| null` | The page meta description, or `null` if unavailable |
| `screenshot` | `string \| null` | Base64 encoded screenshot, or `null` if `takeScreenshots` is `false` or request failed |
| `url` | `string` | The URL for each page request |

#### Success Response (200 OK)

```json
{
  "status": "Success",
  "data": [
    {
      "status": "Success",
      "message": "Successfully retrieved the page data",
      "title": "Example Domain",
      "description": "Example Domain. This domain is for use in illustrative examples...",
      "screenshot": "iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://example.com"
    },
    {
      "status": "Success",
      "message": "Successfully retrieved the page data",
      "title": "GitHub: Let's build from here",
      "description": "GitHub is where over 100 million developers shape...",
      "screenshot": "iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://github.com"
    }
  ],
  "validation": []
}
```

#### Error Response (500 Internal Server Error)

```json
{
  "status": "Error",
  "message": "Failed to track pages"
}
```

## Next Steps

- More tests
- Expanded edge case handling
- API validation (e.g., excessive number of urls)
