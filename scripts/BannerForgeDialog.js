export class BannerForgeDialog extends FormApplication {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "banner-forge-dialog",
      title: "Banner Forge",
      template: "modules/banner-forge/templates/display-dialog.html",
      width: 400,
      height: "auto",
      resizable: true,
      closeOnSubmit: true
    });
  }

  async getData() {
    const presetsPath = game.settings.get("banner-forge", "presetsFilePath");
    try {
      const response = await fetch(presetsPath);
      this.presets = await response.json();
    } catch (error) {
      console.error(`Banner Forge | Error loading presets from ${presetsPath}:`, error);
    }

    return {
      title: "",
      subtitle: "",
      duration: game.settings.get("banner-forge", "defaultDuration"),
      titleColor: game.settings.get("banner-forge", "defaultTitleColor"),
      subtitleColor: game.settings.get("banner-forge", "defaultSubtitleColor"),
      soundVolume: game.settings.get("banner-forge", "defaultSoundVolume"),
      soundPath: "",
      imagePath: "",
      backgroundColor: game.settings.get("banner-forge", "defaultBackgroundColor"),
      backgroundOpacity: game.settings.get("banner-forge", "defaultBackgroundOpacity"),
      cornerRadius: game.settings.get("banner-forge", "defaultCornerRadius"),
      presets: this.presets
    };
  }

  _fillForm(html, data) {
    // Fill form fields with data provided, only if the data has a defined value
    if (data.title !== undefined) html.find("input[name='title']").val(data.title).trigger('input');
    if (data.subtitle !== undefined) html.find("input[name='subtitle']").val(data.subtitle).trigger('input');
    if (data.duration !== undefined) html.find("input[name='duration']").val(data.duration).trigger('input');
    if (data.titleColor !== undefined) html.find("input[name='titleColor']").val(data.titleColor).trigger('input');
    if (data.subtitleColor !== undefined) html.find("input[name='subtitleColor']").val(data.subtitleColor).trigger('input');
    if (data.backgroundColor !== undefined) html.find("input[name='backgroundColor']").val(data.backgroundColor).trigger('input');
    if (data.backgroundOpacity !== undefined) html.find("input[name='backgroundOpacity']").val(data.backgroundOpacity).trigger('input');
    if (data.cornerRadius !== undefined) html.find("input[name='cornerRadius']").val(data.cornerRadius).trigger('input');
    if (data.soundPath !== undefined) html.find("input[name='soundPath']").val(data.soundPath).trigger('input');
    if (data.soundVolume !== undefined) html.find("input[name='soundVolume']").val(data.soundVolume).trigger('input');
    if (data.imagePath !== undefined) html.find("input[name='imagePath']").val(data.imagePath).trigger('input');
    this.setPosition();
  }

  activateListeners(html) {
    super.activateListeners(html);

    const presetSelector = html.find("select[name='presetSelector']");
    presetSelector.on("change", (event) => {
      const selectedPresetName = event.target.value;
      if (selectedPresetName === "custom") {
        this._fillForm(html, this.getData()); // Use default values
      } else {
        const selectedPreset = this.presets.find(preset => preset.name === selectedPresetName);
        if (selectedPreset) {
          this._fillForm(html, selectedPreset); // Use preset data
        }
      }
    });

    const durationInput = html.find("input[name='duration']");
    const durationOutput = html.find("output[name='durationOutput']");
    // Initialize the duration output display
    durationOutput.text(`${durationInput.val()}s`);
    // Update the duration output display when slider changes
    durationInput.on("input", (event) => {
      durationOutput.text(`${event.target.value}s`);
    });

    // Toggle advanced options
    html.find("button[name='toggleAdvanced']").on("click", () => {
      const advancedOptions = html.find(".advanced-options");
      advancedOptions.toggle();
      const isVisible = advancedOptions.is(":visible");
      html.find("button[name='toggleAdvanced']").text(isVisible ? "Less Options" : "More Options");
      this.setPosition(); // Adjust dialog size dynamically
    });

    // File picker setup
    html.find("button[name='filePickerButton']").on("click", () => {
      new FilePicker({
        type: "image",
        callback: (path) => html.find("input[name='imagePath']").val(path)
      }).browse();
    });
    html.find("button[name='soundPickerButton']").on("click", () => {
      new FilePicker({
        type: "audio",
        callback: (path) => html.find("input[name='soundPath']").val(path)
      }).browse();
    });

    // Sync color pickers with hex inputs
    html.find("input[name='titleColorPicker']").on("input", (event) => {
      html.find("input[name='titleColor']").val(event.target.value);
    });
    html.find("input[name='titleColor']").on("input", (event) => {
      html.find("input[name='titleColorPicker']").val(event.target.value);
    });

    html.find("input[name='subtitleColorPicker']").on("input", (event) => {
      html.find("input[name='subtitleColor']").val(event.target.value);
    });
    html.find("input[name='subtitleColor']").on("input", (event) => {
      html.find("input[name='subtitleColorPicker']").val(event.target.value);
    });

    html.find("input[name='backgroundColor']").on("input", (event) => {
      html.find("input[name='backgroundColorPicker']").val(event.target.value);
    });

    html.find("input[name='backgroundColorPicker']").on("input", (event) => {
      html.find("input[name='backgroundColor']").val(event.target.value);
    });

    const backgroundOpacityInput = html.find("input[name='backgroundOpacity']");
    const backgroundOpacityOutput = html.find("output[name='backgroundOpacityOutput']");
    backgroundOpacityOutput.text(`${backgroundOpacityInput.val()}`);
    backgroundOpacityInput.on("input", (event) => {
      backgroundOpacityOutput.text(`${event.target.value}`);
    });

    const soundVolumeInput = html.find("input[name='soundVolume']");
    const soundVolumeOutput = html.find("output[name='soundVolumeOutput']");
    soundVolumeOutput.text(`${soundVolumeInput.val()}`);
    soundVolumeInput.on("input", (event) => {
      soundVolumeOutput.text(event.target.value);
    });

    const cornerRadiusInput = html.find("input[name='cornerRadius']");
    const cornerRadiusOutput = html.find("output[name='cornerRadiusOutput']");
    cornerRadiusOutput.text(`${cornerRadiusInput.val()}px`);
    cornerRadiusInput.on("input", (event) => {
      cornerRadiusOutput.text(`${event.target.value}px`);
    });

    html.find("button[name='saveAsMacro']").on("click", () => {
      this._createMacro();
    });

    // Bind submit button to call displayTitle function
    html.find("button[type='submit']").click(this._onSubmit.bind(this));
  }

  async _createMacro() {
    // Collect current form data
    const formData = this.element[0].querySelector("form");
    const data = {
      title: formData.title.value,
      subtitle: formData.subtitle.value,
      duration: parseInt(formData.duration.value),
      titleColor: formData.titleColor.value,
      subtitleColor: formData.subtitleColor.value,
      backgroundColor: formData.backgroundColor.value,
      backgroundOpacity: parseFloat(formData.backgroundOpacity.value),
      cornerRadius: parseInt(formData.cornerRadius.value),
      soundPath: formData.soundPath.value,
      soundVolume: parseFloat(formData.soundVolume.value),
      imagePath: formData.imagePath.value
    };

    // Create a macro command to call displayBanner with the collected data
    const macroCommand = `
      window.bannerSocket.executeForEveryone("displayBanner", ${JSON.stringify(data)});
    `;

    // Specify the folder name for the macro
    const folderName = "Banner Forge Macros";

    // Check if the folder already exists
    let folder = game.folders.find(f => f.name === folderName && f.type === "Macro");
    if (!folder) {
      // Create the folder if it doesn't exist
      folder = await Folder.create({
        name: folderName,
        type: "Macro",
        parent: null
      });
    }

    // Create and save the macro
    Macro.create({
      name: `Banner: ${data.title || 'Untitled'}`,
      type: "script",
      img: "icons/sundries/flags/banner-flag-white.webp", // You can use a custom icon
      command: macroCommand,
      folder: folder.id,
      flags: { "banner-forge": true }
    });

    ui.notifications.info("Banner Forge | Macro created successfully.");
  }

  async _onSubmit(event) {
    event.preventDefault();

    const form = $(event.currentTarget).closest("form")[0];
    const title = form.title.value.trim();

    if (!title) {
      ui.notifications.warn("Banner Forge | The title cannot be empty. Please enter a title.");
      return;
    }

    const subtitle = form.subtitle.value.trim();
    const duration = parseInt(form.duration.value);
    const imagePath = form.imagePath.value;

    const titleColor = form.titleColor.value;
    const subtitleColor = form.subtitleColor.value;

    const backgroundColor = form.backgroundColor.value;
    const backgroundOpacity = parseFloat(form.backgroundOpacity.value);
    const cornerRadius = parseInt(form.cornerRadius.value);

    const soundPath = form.soundPath.value;
    const soundVolume = parseFloat(form.soundVolume.value);

    console.log("Banner Forge | Emitting socket event with the following data:", {
      title,
      subtitle,
      duration,
      imageUrl: imagePath,
      titleColor,
      subtitleColor,
      backgroundColor,
      backgroundOpacity,
      cornerRadius,
      soundPath,
      soundVolume
    });

    window.bannerSocket.executeForEveryone("displayBanner", {
      title,
      subtitle,
      duration,
      imageUrl: imagePath,
      titleColor,
      subtitleColor,
      backgroundColor,
      backgroundOpacity,
      cornerRadius,
      soundPath,
      soundVolume
    });
  }
}
