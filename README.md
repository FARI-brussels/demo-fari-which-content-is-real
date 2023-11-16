## Documentation
### High-Level Overview

#### Purpose and Problem Solving
The described codebase supports a web-based quiz application. Its key purpose is to present users with a series of media (images or videos) and challenge them to identify which piece of content is real and which one has been generated by an AI. After 10 rounds, the user receives a score reflecting their success rate.


#### Architecture and Design
The application is structured as a front-end-only system with multiple web assets such as HTML, CSS, and JavaScript, supported by a simple HTTP server implemented in Python (`server.py`). The front-end fetches content from the Content Management System (CMS). The app is multilingual (en, fr, nl)

The design is mainly event-driven as interactions are managed through JavaScript's event listeners—particularly for media selection and navigation between quiz rounds.

### Code Organization

#### Directory Structure
- `styles.css` contains the styles for the web pages.
- `index.html` is the main entry point of the web application.
- `server.py` enables an HTTP server for serving the application.
- `script.js` contains the interactive logic of the app.
- `fonts/` Contains font files (implied by the CSS but not listed in the structure).

#### Key Files
- `styles.css`: Handles all the styling and layout of the web pages, defining fonts, alignment, spacing, colors, and responsiveness.
- `index.html`: The main HTML document defining the structure of the web interface.
- `server.py`: Implements a basic Python server to serve the web application locally.
- `script.js`: Manages user interactions, handles communication with the backend, updates the DOM based on the game state, and contains some translatable text content.

### Functionality and Methods

In `script.js`, the major functions and their responsibilities include:
- Full application initialization upon 'DOMContentLoaded'.
- Fetching media from a CMS (`getMedia` function).
- Setting up each media round (`setMedia` function).
- Handling user's choices (`handleClick` function).
- Randomizing media arrays (`shuffle` function).
- Restarting the game (`restartGame` function).

Each of these functions is critical and influences how the game progresses and how user interactions are handled.

### Code Examples and Usage

To provide some examples:

Randomization of media positions within a round (snippet from `setMedia` function):
```javascript
if (Math.random() < 0.5) {
  setMediaElement(media1, mediaArrays.realContentUrls[currentIndex], isVideo1, mediaArrays.realContentCaptions[currentIndex], 'true');
  setMediaElement(media2, mediaArrays.fakeContentUrls[currentIndex], isVideo2, mediaArrays.fakeContentCaptions[currentIndex], 'false');
} else {
  setMediaElement(media1, mediaArrays.fakeContentUrls[currentIndex], isVideo2, mediaArrays.fakeContentCaptions[currentIndex], 'false');
  setMediaElement(media2, mediaArrays.realContentUrls[currentIndex], isVideo1, mediaArrays.realContentCaptions[currentIndex], 'true');
}
```

Locating and using the translations object for setting language-specific texts:
```javascript
title.textContent = translations[currentLanguage].appTitle;
description.textContent = translations[currentLanguage].description;
scoreText.textContent = translations[currentLanguage].scoreText;
nextText.textContent = translations[currentLanguage].nextText;
```

### Dependencies and External Libraries

There are no external libraries encapsulated within the codebase presented. However, the application does have a dependency on an external API (hosted at `http://46.226.110.124:1337`) for fetching the media content.

### Environment and Setup

For setting up the development environment, based on the provided files, the process should be as follows:

1. Clone the repository to your local system.
2. Install Python, if not already available.
3. Execute `server.py` to launch the local server, serving the application on `localhost:8000/{language}` (en, nl or fr).
4. (Optional) If there are fonts in the `fonts/` directory, ensure they are correctly referenced in `styles.css`.
5. Install any required browser to test the application, considering cross-browser compatibility.
6. Access the application by navigating to the local server's address in your web browser.

For deploying to production, additional steps would be needed, such as setting up a more robust web server (e.g., Nginx or Apache), possibly containerization (using Docker), and deploying to a web host or cloud service provider.