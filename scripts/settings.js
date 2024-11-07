export function registerSettings() {
  console.log("Banner Forge | Registering module settings...");

  // Register Presets File Location setting
  game.settings.register("banner-forge", "presetsFilePath", {
    name: "Presets File Location",
    hint: "Specify the path to the JSON file containing banner presets.",
    scope: "world",
    config: true,
    type: String,
    default: "modules/banner-forge/presets/presets.json", // Default path to the presets file
    filePicker: true, // Allows file browsing in Foundry
    onChange: value => console.log(`Banner Forge | Presets File Location set to ${value}`)
  });

  // Register Default Title Color setting
  game.settings.register("banner-forge", "defaultTitleColor", {
    name: "Default Title Color",
    hint: "Choose the default color for the title text.",
    scope: "world",
    config: true,
    type: String,
    default: "#ffffff",
    onChange: value => console.log(`Banner Forge | Default Title Color set to ${value}`)
  });

  // Register Default Subtitle Color setting
  game.settings.register("banner-forge", "defaultSubtitleColor", {
    name: "Default Subtitle Color",
    hint: "Choose the default color for the subtitle text.",
    scope: "world",
    config: true,
    type: String,
    default: "#cccccc",
    onChange: value => console.log(`Banner Forge | Default Subtitle Color set to ${value}`)
  });

  // Register Default Sound Volume setting
  game.settings.register("banner-forge", "defaultSoundVolume", {
    name: "Default Sound Volume",
    hint: "Set the default volume level for sound effects (0.0 - 1.0).",
    scope: "world",
    config: true,
    type: Number,
    default: 0.8,
    range: {
      min: 0.0,
      max: 1.0,
      step: 0.1
    },
    onChange: value => console.log(`Banner Forge | Default Sound Volume set to ${value}`)
  });

  // Register Default Duration setting
  game.settings.register("banner-forge", "defaultDuration", {
    name: "Default Duration",
    hint: "Set the default duration (in seconds) for displaying the banner.",
    scope: "world",
    config: true,
    type: Number,
    default: 5,
    range: {
      min: 5,
      max: 60,
      step: 5
    },
    onChange: value => console.log(`Banner Forge | Default Duration set to ${value} seconds`)
  });

  game.settings.register("banner-forge", "defaultBackgroundColor", {
    name: "Default Background Color",
    hint: "Choose the default background color for the banner.",
    scope: "world",
    config: true,
    type: String,
    default: "#000000",
    onChange: value => console.log(`Banner Forge | Default Background Color set to ${value}`)
  });

  game.settings.register("banner-forge", "defaultBackgroundOpacity", {
    name: "Default Background Opacity",
    hint: "Set the default opacity for the background (0.0 - 1.0).",
    scope: "world",
    config: true,
    type: Number,
    default: 0.8,
    range: { min: 0.0, max: 1.0, step: 0.1 },
    onChange: value => console.log(`Banner Forge | Default Background Opacity set to ${value}`)
  });

  game.settings.register("banner-forge", "defaultCornerRadius", {
    name: "Default Corner Radius",
    hint: "Set the default corner radius (in pixels) for the banner.",
    scope: "world",
    config: true,
    type: Number,
    default: 16,
    range: { min: 0, max: 512, step: 1 },
    onChange: value => console.log(`Banner Forge | Default Corner Radius set to ${value}px`)
  });

}