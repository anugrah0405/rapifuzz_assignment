
# Next.js Frontend Assignment

## Setup Instructions

1. **Install dependencies:**
	```sh
	npm install
	```
2. **Configure environment variables:**
	- Copy `.env.local.example` to `.env.local` (or use the provided `.env.local`)
	- Set `NEXT_PUBLIC_API_BASE_URL` to your API endpoint (default: https://jsonplaceholder.typicode.com)
3. **Run the development server:**
	```sh
	npm run dev
	```
4. **Open your browser:**
	Visit [http://localhost:3000](http://localhost:3000)

---

## Features
- Register and Login with JWT authentication (frontend only, static secret)
- Idle user detection and auto-logout after 2 minutes of inactivity
- Home page with image list, search, and server-side pagination (API-driven)
- Modal popup for image details on row click
- Loader and error handling for all API calls
- Fallback to `No-Image-Placeholder.svg` if image/thumbnail fails to load
- Form validation with live feedback for login and registration
- Toast notifications for registration and logout events
- Organized code in `components`, `utils`, `hooks`, and `styles` folders

---

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the image API (default: https://jsonplaceholder.typicode.com)

---

## Notes
- JWT is handled on the frontend with a static secret key (demo only)
- Images are fetched from the API defined in `.env.local`
