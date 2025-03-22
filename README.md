# NFH Archiver

NFH Archiver is a tool designed to compress and decompress .BND files used in the Neighbours from Hell game. It allows users to extract important files such as language resources and game data for modding purposes, and then repackage them to ensure the game runs correctly.

## Features

- Extract contents from .BND files
- View and modify game resources
- Repack files back into .BND format
- Web-based interface for easy access
- No installation required - runs in browser

## How to Use

1. Upload a .BND file using the interface
2. Extract the contents to view or modify files
3. Make your desired modifications
4. Repack the files back into .BND format
5. Download the modified .BND file

## Technical Details

This tool is built as a web application, making it accessible across different platforms without the need for installation. It handles the proprietary .BND file format used in Neighbours from Hell games while maintaining file integrity during the compression and decompression process.

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser

## Project Structure

- `index.html`: Main entry point
- `assets/`: Contains static assets (images, fonts, etc.)
- `css/`: Stylesheet files
- `js/`: JavaScript files

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Vite (Development server and build tool)
- TypeScript
- PostCSS

## Development

To run the development server:

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
