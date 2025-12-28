/*
 * Gaming Tools Suite v8.2
 * Copyright (c) 2025 Volt & Tinso
 * All Rights Reserved.
 * Unauthorized copying of this file is strictly prohibited.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Ignore messages not intended for this offscreen document.
  if (message.target !== "offscreen") {
    return;
  }

  switch (message.action) {
    case "play":
      handlePlay(message.embedCode, sendResponse);
      break;
    default:
      // Optional: Handle unknown actions
      sendResponse({ success: false, error: "Unknown action" });
  }
  
  // Return true to indicate that the response is sent asynchronously.
  return true;
});

/**
 * Handles the 'play' action by embedding the provided HTML code.
 * @param {string} embedCode The HTML code to embed.
 * @param {function} sendResponse The function to call with the response.
 */
function handlePlay(embedCode, sendResponse) {
  const embedContainer = document.getElementById("spotify-embed-container");
  if (embedContainer) {
    // Using innerHTML is necessary here to parse the embed code string.
    // This is considered safe if the embedCode is from a trusted source.
    embedContainer.innerHTML = embedCode;
    sendResponse({ success: true });
  } else {
    sendResponse({ success: false, error: "Embed container not found" });
  }
}