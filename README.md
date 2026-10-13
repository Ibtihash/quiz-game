# Think & Play

Think & Play is a browser-based collection of quiz and puzzle games built with React, Vite, Express, and MongoDB. Players can use the games without an account, enter a display name when a game asks for one, and view scores temporarily during the current browser session.

## Games

- **Quiz:** Answer knowledge questions, use per-question hints, and submit the final score.
- **Wordle:** Find the five-letter word in up to six guesses. Includes keyboard feedback and limited hints.
- **Crossword Puzzle:** Fill a generated grid, choose a difficulty, use hints, and race the timer.
- **Snake:** Eat fruit with the arrow keys. Easy wraps around the board; harder modes add collision rules and obstacles.
- **Hangman:** Guess the hidden word with a maximum of six incorrect guesses.
- **Scramble:** Unscramble a word as quickly as possible.
- **2048:** Combine matching number tiles with the arrow keys and reach 2048.
- **Riddles:** Solve eight riddles, use hints, build a streak, and save the round score.

Every game has an **Instructions** button with a game-specific popup. The app no longer requires login or signup to play. Scores are held only in frontend memory and are cleared when the website is refreshed or the tab is closed.

## Tech Stack

- React 18 and React Router
- Vite
- Tailwind CSS and Bootstrap
- Node.js and Express
- MongoDB with Mongoose
- Vercel deployment

## Project Structure

```text
client/                  React/Vite frontend
	src/App.jsx            Routes and shared layout
	src/api.js             Frontend API client
	src/components/        Shared React components
	src/pages/             Game and application pages
server/                  Express backend
	server.js              Express app and route registration
	db.js                  Cached MongoDB connection
	models/                Mongoose schemas
	routes/                Score and question endpoints
	.env.example           Server environment variable template
vercel.json              Vercel build and routing configuration
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB locally or a MongoDB Atlas cluster

## Installation

Clone the repository and install dependencies in both workspaces:

```powershell
git clone https://github.com/Ibtihash/quiz-game.git
Set-Location quiz-game
npm install --prefix client
npm install --prefix server
```

Create the server environment file:

```powershell
Copy-Item server/.env.example server/.env
```

Edit `server/.env` and set `MONGODB_URI` to a reachable MongoDB database. Do not commit `.env` or place credentials in frontend files.

## Environment Variables

The backend reads these variables:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Local Express port. Defaults to `4000`. |
| `MONGODB_URI` | Yes for score/database endpoints | MongoDB connection string. |
| `CORS_ORIGIN` | No | Comma-separated allowed frontend origins. The deployed frontend origin is also allowed by the server. |
| `EMAIL_USER` | Optional | Reserved email-service username for password-related legacy backend routes. |
| `EMAIL_PASS` | Optional | Reserved email-service password. |
| `EMAIL_SERVICE` | Optional | Email provider name, such as `gmail`. |

Example local values:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/quizgame
CORS_ORIGIN=http://localhost:5173
```

## Run Locally

Start the backend in one terminal:

```powershell
npm --prefix server run dev
```

Start the frontend in a second terminal:

```powershell
npm --prefix client run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies local `/api` requests to `http://localhost:4000`, while the deployed frontend currently uses the API URL configured in `client/src/api.js`.

For a production frontend preview:

```powershell
npm --prefix client run build
npm --prefix client run preview
```

## API Endpoints

The deployed API base URL is `https://quiz-game-uywu.vercel.app`. The frontend API client is in `client/src/api.js`.

### Health and Questions

```text
GET  /api/health
GET  /api/questions
```

### Score resources

Scores are currently managed by the frontend in-memory store in `client/src/api.js`. They are not sent to MongoDB and are intentionally cleared on refresh. The backend score routes remain in the repository for possible future persistence, but the current website does not call them.

```text
/api/quiz-scores
/api/wordle-scores
/api/crossword-scores
/api/snake-scores
/api/hangman-scores
/api/scramble-scores
/api/game2048-scores
/api/riddles-scores
```

The temporary Riddles score shape is:

```json
{
	"username": "Guest",
	"score": 65,
	"riddlesSolved": 7
}
```

The `username` value is a display name for the current session; it is not an account login.

## Deployment on Vercel

This repository can be deployed through GitHub integration or the Vercel CLI. The repository contains `vercel.json`, which routes the server entrypoint through `server/server.js`.

### Recommended GitHub deployment

1. Import the GitHub repository `Ibtihash/quiz-game` into Vercel.
2. Set the backend project's root directory and build settings according to the Vercel project layout.
3. Add these Production environment variables in the backend Vercel project:

	 ```env
	 MONGODB_URI=your_mongodb_atlas_connection_string
	 CORS_ORIGIN=https://thinkandplay.vercel.app
	 ```

4. Deploy the backend and confirm:

	 ```text
	 https://quiz-game-uywu.vercel.app/api/health
	 ```

	 Expected response:

	 ```json
	 {"ok":true}
	 ```

5. Deploy the frontend project from the same `main` branch. Confirm its production URL is `https://thinkandplay.vercel.app`.

Every push to `main` should create a new Vercel deployment when GitHub integration is enabled.

### Vercel CLI

From the repository root:

```powershell
npm install -g vercel
vercel login
vercel --prod
```

If the CLI reports that the project is not linked, run `vercel link` and select the correct Vercel project before running `vercel --prod`.

## Updating GitHub

After making a change:

```powershell
git status
git add .
git commit -m "Describe the change"
git push origin main
```

Pushing to `main` triggers Vercel automatically when the repository is connected to the deployment project.

## Troubleshooting

### API or score requests fail

- Check that `MONGODB_URI` is set in Vercel Production environment variables.
- Confirm the MongoDB Atlas network access rules allow the deployed server to connect.
- Open `/api/health` directly and inspect the Vercel deployment logs.
- Confirm `CORS_ORIGIN` contains the exact frontend origin, including `https://` and without a trailing slash.

### Direct game URL returns 404

Redeploy the frontend after confirming the Vercel project serves the Vite `client/dist` output and includes the SPA fallback configured for client-side routes.

### Browser console shows extension errors

Messages mentioning `chrome-extension://`, `contentscript.js`, `ObjectMultiplex`, or `searchEmails` come from browser extensions and are not application errors. Test in an incognito window or with extensions disabled to isolate them.

### Login and signup URLs

Authentication pages were intentionally removed. `/login`, `/signup`, `/forgot-password`, and `/reset-password/:token` redirect to the homepage. Scores use a local display name instead of account authentication.

## License

No license is currently specified for this repository.
