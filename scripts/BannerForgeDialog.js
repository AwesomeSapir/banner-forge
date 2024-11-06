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

  getData() {
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
      cornerRadius: game.settings.get("banner-forge", "defaultCornerRadius")
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

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

    // Bind submit button to call displayTitle function
    html.find("button[type='submit']").click(this._onSubmit.bind(this));
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
