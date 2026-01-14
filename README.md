# LeetCode User Statistics API

A serverless API that fetches LeetCode user profile data, including attempted questions, ranking, and contest statistics.

## API Endpoint

**GET** `/api?username=<username>`

### Example Request

```
https://your-project.vercel.app/api?username=john_doe
```

### Example Response

```json
{
  "username": "john_doe",
  "profile": {
    "realName": "John Doe",
    "ranking": 12345,
    "reputation": 1500,
    "avatar": "https://...",
    "aboutMe": "Software Engineer"
  },
  "problemsSolved": {
    "easy": { "solved": 50, "attempted": 60 },
    "medium": { "solved": 30, "attempted": 45 },
    "hard": { "solved": 5, "attempted": 15 },
    "total": { "solved": 85, "attempted": 120 }
  },
  "contestRanking": {
    "rating": 1800,
    "globalRank": 5000,
    "attendedContests": 10,
    "topPercentage": "15.50%"
  }
}
```

## Deployment to Vercel

1. **Create a GitHub repository** and upload these files:

   - `api.js`
   - `package.json`
   - `api/index.js`
   - `README.md`

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect and deploy the API

3. **Your API will be live** at `https://your-repo-name.vercel.app/api`

## Local Development

```bash
# Install dependencies (none required, uses built-in fetch)
npm install

# Run locally (for testing the class)
node api.js
```

## Features

- User profile information
- Problem solving statistics by difficulty
- Contest ranking and rating
- Global ranking
- CORS enabled for web applications
