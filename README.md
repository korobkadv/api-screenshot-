📸 Screenshot API

A simple Node.js and Puppeteer-based web application for capturing website screenshots with customizable options.
🚀 Quick Start Guide
Clone the repository and set up:

git clone <REPO_URL>
cd screenshot-api
npm install

Run the server:

npm start

Open in browser:

    Visit: http://localhost:3000
    Fill the form and generate a screenshot.

📦 Project Structure:

screenshot-api/
├── public/         # Frontend (HTML, CSS, JS)
├── server.js       # Backend (Express & Puppeteer)
├── images/         # (Optional) Storage for screenshots
├── package.json    # Project dependencies
├── .gitignore      # Ignore node_modules & images
└── README.md       # This file

🌐 API Usage (Optional for Developers)

    Endpoint: POST /api/screenshot
    Payload (JSON):

{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "format": "png"
}

Response: Image file URL.
