# unspoken
Inspired by the Unsent Project Archive.
Unspoken // Unsent Archive App
A local-first, offline desktop application inspired by the Unsent Project concept. It serves as a personal digital archive space for storing and organizing letters that were written but never sent.

Built natively for macOS using React, Vite, Electron, and SQLite3.

Local-First & Privacy Specs
Unlike typical web apps, Unspoken prioritizes complete data ownership:

Zero Cloud Analytics: Your letters never touch a remote server, database, or API tracking pipeline.

Offline Storage: Everything is saved locally on your SSD using a secure standalone SQLite database configuration.

Update Isolation: The display engine (Unspoken.app) is separated entirely from the raw data layout, ensuring app updates or restarts never wipe your archives.

Download & Run the Mac Installer
If you just want to run the application on your Apple Silicon Mac (M1/M2/M3/M4):

Navigate to the Releases tab on the right side of this repository page.

Download the latest installer binary: Unspoken-1.0.0-arm64.dmg.

Open the disk image and drag Unspoken straight into your /Applications folder.

Note on macOS Safety Validation: Because this standalone app is compiled outside Apple's paid Mac App Store developer gate, your system might surface an "unidentified developer" warning the first time you boot it. To bypass this safely, simply Right-Click the app icon, select Open, and click confirm.

For Developers: Run from Source
If you want to tweak the design, audit the database components, or run the codebase locally:

1. Prerequisites
Ensure you have Node.js installed on your machine.

2. Setup Dependencies
Clone the repository and install the framework components:

git clone https://github.com/PurohitYuvvraj/unspoken.git
cd unspoken
npm install

3. Start Development Mode
Boot up Vite's hot-reloading frontend script paired alongside the main Electron process wrapper:

npm run dev

4. Build Custom Compilation Bundles
If you want to package your own customized Apple Silicon machine bundle executables locally:

npm run package:mac

📂 System File Architecture
Database File path: ~/Library/Application Support/Unspoken/unsent-letters.db

Core Front-end Views: /src

Electron Window Management Configurations: /electron/main.js
