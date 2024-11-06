import { BannerForgeDialog } from './scripts/BannerForgeDialog.js';
import { registerSettings } from './scripts/settings.js';

// Define bannerSocket globally
window.bannerSocket = null;
window.displayBanner = displayBanner;

Hooks.once("init", () => {
  console.log("Banner Forge | Initializing module...");

  // Register module settings
  registerSettings();

  // Listen for changes to any relevant settings
  Hooks.on("updateSetting", (setting) => {
    if (setting.key.startsWith("banner-forge.default")) {
      const dialog = Object.values(ui.windows).find(w => w instanceof BannerForgeDialog);
      if (dialog) dialog.render(true); // Re-render the dialog if open
    }
  });
});

// Initialize socket and setup on 'ready'
Hooks.once('ready', function () {
  console.log("Banner Forge | Module initialized successfully.");

  // Set up a custom socket for this module
  window.bannerSocket = socketlib.registerModule("banner-forge");

  // Register a socket event that listens for 'displayBanner' and displays the title text
  window.bannerSocket.register("displayBanner", displayBanner);

  //TODO: TESTING
  //new BannerForgeDialog().render(true);
});

// Register the button in the Journal Notes layer
Hooks.on('getSceneControlButtons', controls => {
  const journalControls = controls.find(control => control.name === "notes");

  if (journalControls) {
    console.log("Banner Forge | Found Journal Notes controls, adding custom button.");

    journalControls.tools.push({
      name: "displayBanner",
      title: "Banner Forge",
      icon: "fas fa-flag",
      visible: game.user.isGM,
      onClick: () => {
        console.log("Banner Forge | Banner Forge button clicked.");
        new BannerForgeDialog().render(true);
      },
      button: true
    });
  } else {
    console.log("Banner Forge | Journal Notes controls not found.");
  }
});

function displayBanner({ title = "Title", subtitle, duration, imageUrl, titleColor, subtitleColor, soundPath, backgroundColor, backgroundOpacity, cornerRadius, soundVolume } = {}) {
  console.log("Banner Forge | Displaying banner with custom data.");

  // Check if a banner display already exists and remove it
  const existingBanner = document.querySelector(".banner-popup");
  if (existingBanner) {
    existingBanner.remove();
  }

  // Use provided colors if available, otherwise fall back to settings
  titleColor = titleColor || game.settings.get("banner-forge", "defaultTitleColor");
  subtitleColor = subtitleColor || game.settings.get("banner-forge", "defaultSubtitleColor");
  duration = duration || game.settings.get("banner-forge", "defaultDuration");
  backgroundColor = backgroundColor || game.settings.get("banner-forge", "defaultBackgroundColor");
  backgroundOpacity = backgroundOpacity != null ? backgroundOpacity : game.settings.get("banner-forge", "defaultBackgroundOpacity");
  cornerRadius = cornerRadius != null ? cornerRadius : game.settings.get("banner-forge", "defaultCornerRadius");
  soundVolume = soundVolume != null ? soundVolume : game.settings.get("banner-forge", "defaultSoundVolume");

  const bannerElement = document.createElement("div");
  bannerElement.className = "banner-popup";

  const rgb = hexToRgb(backgroundColor);
  const rgbaBackgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;
  bannerElement.style.backgroundColor = rgbaBackgroundColor;
  bannerElement.style.borderRadius = `${cornerRadius}px`;

  // Add image if provided
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "title-image";
    bannerElement.appendChild(img);

    img.onload = () => {
      console.log("Banner Forge | Image loaded. Starting fade-out timer.");
      startFadeOutTimer(bannerElement, duration);
    }
  } else {
    startFadeOutTimer(bannerElement, duration);
  }

  const textContainer = document.createElement("div");
  textContainer.className = "text-container";

  const titleText = document.createElement("h1");
  titleText.style.color = titleColor;
  titleText.innerText = title;
  textContainer.appendChild(titleText);

  if (subtitle) {
    const divider = document.createElement("hr");
    divider.className = "title-divider";
    const dividerColor = getContrastingColor(rgb);
    divider.style.borderTopColor = dividerColor;
    textContainer.appendChild(divider);

    const subtitleText = document.createElement("h2");
    subtitleText.style.color = subtitleColor;
    subtitleText.innerText = subtitle;
    textContainer.appendChild(subtitleText);
  }

  bannerElement.appendChild(textContainer);
  document.body.appendChild(bannerElement);

  // Play sound using Foundry's AudioHelper if provided
  if (soundPath) {
    console.log("Banner Forge | Playing sound:", soundPath);
    foundry.audio.AudioHelper.play({ src: soundPath, volume: soundVolume, loop: false }, true)
      .catch(error => console.error("Banner Forge | Error playing sound:", error));
  }
}

function startFadeOutTimer(element, duration) {
  setTimeout(() => {
    element.style.animation = "fadeOut 1s forwards";
    setTimeout(() => {
      element.remove();
    }, 1000);
  }, duration * 1000);
}

function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getContrastingColor({ r, g, b }) {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
}