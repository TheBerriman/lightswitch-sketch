const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;
const selection = document.selectedLayers;

var textFieldLight, textFieldDark;
var hexLight, hexDark;
var artboardsCheckbox, symbolsCheckbox, textLayersCheckbox, shapeLayersCheckbox, overridesCheckbox;

export function getInputFromUser(context){
  // Create and show dialog window
  var window = createWindow(context);
  var alert = window[0];
  var response = alert.runModal();
  if (response == "1000") {

    // Artboard background colours
    hexLight = textFieldLight.stringValue();
    hexDark = textFieldDark.stringValue();

    // Validate colours for valid hex strings
    if ((!/^[0-9A-F]{6}$/i.test(hexLight.trim().replace('#', ''))) || (!/^[0-9A-F]{6}$/i.test(hexDark.trim().replace('#', '')))) {
      sketch.UI.alert('Cannot Save Changes', 'Invalid background color entered for Artboards');
      getInputFromUser();
      return;
    }

    // Toggle checkboxes
    artboardsCheckbox = artboardsCheckbox.stringValue();
    symbolsCheckbox = symbolsCheckbox.stringValue();
    textLayersCheckbox = textLayersCheckbox.stringValue();
    shapeLayersCheckbox = shapeLayersCheckbox.stringValue();
    overridesCheckbox = overridesCheckbox.stringValue();

    updateSettings();

    return true;
  } else if (response == "1001") {
      resetSettings();
      return false;
  } else if (response == "1002") {
      return false;
  }
}

export function createWindow() {

  var alert = COSAlertWindow.new();

  //alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed('icon.png').path()));
  alert.setMessageText("Light Switch Settings");

  // Creating dialog buttons
  alert.addButtonWithTitle("Save");
  alert.addButtonWithTitle("Reset");
  alert.addButtonWithTitle("Cancel");

  // Creating the view
  var viewWidth = 300;
  var viewHeight = 205;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  // Create and configure your inputs here
  // ...

  // Create labels
    var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 52, (viewWidth - 30), 55));
    var lightBgLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 105, (viewWidth - 30), 55));
    var darkBgLabel = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 105, (viewWidth - 30), 55));
    var toggleLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 163, (viewWidth - 30), 55));

    // Configure labels
    infoLabel.setStringValue("Change default light/dark Artboard colors and disable switching specific layer types.");
    infoLabel.setSelectable(false);
    infoLabel.setEditable(false);
    infoLabel.setBezeled(false);
    infoLabel.setDrawsBackground(false);

    lightBgLabel.setStringValue("Light BG Color");
    lightBgLabel.setSelectable(false);
    lightBgLabel.setEditable(false);
    lightBgLabel.setBezeled(false);
    lightBgLabel.setDrawsBackground(false);

    darkBgLabel.setStringValue("Dark BG Color");
    darkBgLabel.setSelectable(false);
    darkBgLabel.setEditable(false);
    darkBgLabel.setBezeled(false);
    darkBgLabel.setDrawsBackground(false);

    toggleLabel.setStringValue("Switch Toggles:");
    toggleLabel.setSelectable(false);
    toggleLabel.setEditable(false);
    toggleLabel.setBezeled(false);
    toggleLabel.setDrawsBackground(false);

  // Add labels to window
    view.addSubview(infoLabel);
    view.addSubview(lightBgLabel);
    view.addSubview(darkBgLabel);
    view.addSubview(toggleLabel);



  // Create text fields
    textFieldLight = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 90, 120, 20));
    textFieldDark = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 90, 120, 20));


    // Optional: Make TAB key work to switch between textfields
    //[textFieldLight setNextKeyView:textFieldDark];
    //[textFieldDark setNextKeyView:textFieldLight];


    // Add text fields to window
    view.addSubview(textFieldLight);
    view.addSubview(textFieldDark);


    // Default text values
    const defaultLightBg = sketch.Settings.settingForKey('lsLightBgColor') || '#ffffff';
    const defaultDarkBg = sketch.Settings.settingForKey('lsDarkBgColor') || '#000000';
    textFieldLight.setStringValue(defaultLightBg);
    textFieldDark.setStringValue(defaultDarkBg);



  // Create checkbox
    artboardsCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 150, viewWidth - viewSpacer, 20));
    symbolsCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(140, viewHeight - 150, viewWidth - viewSpacer, 20));
    textLayersCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 172.5, viewWidth - viewSpacer, 20));
    shapeLayersCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(140, viewHeight - 172.5, viewWidth - viewSpacer, 20));
    overridesCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 195, viewWidth - viewSpacer, 20));


    // Configure checkboxes
    const defaultArtboard = (sketch.Settings.settingForKey('lsToggledArtboards') == 0) ? NSOffState : NSOnState;
    artboardsCheckbox.setButtonType(NSSwitchButton);
    artboardsCheckbox.setBezelStyle(0);
    artboardsCheckbox.setTitle("Artboards");
    artboardsCheckbox.setState(defaultArtboard);

    const defaultSymbols = (sketch.Settings.settingForKey('lsToggledSymbols') == 0) ? NSOffState : NSOnState;
    symbolsCheckbox.setButtonType(NSSwitchButton);
    symbolsCheckbox.setBezelStyle(0);
    symbolsCheckbox.setTitle("Symbols");
    symbolsCheckbox.setState(defaultSymbols);

    const defaultTextLayers = (sketch.Settings.settingForKey('lsToggledTextLayers') == 0) ? NSOffState : NSOnState;
    textLayersCheckbox.setButtonType(NSSwitchButton);
    textLayersCheckbox.setBezelStyle(0);
    textLayersCheckbox.setTitle("Text Styles");
    textLayersCheckbox.setState(defaultTextLayers);

    const defaultShapes = (sketch.Settings.settingForKey('lsToggledShapes') == 0) ? NSOffState : NSOnState;
    shapeLayersCheckbox.setButtonType(NSSwitchButton);
    shapeLayersCheckbox.setBezelStyle(0);
    shapeLayersCheckbox.setTitle("Shape Styles");
    shapeLayersCheckbox.setState(defaultShapes);

    const defaultOverrides = (sketch.Settings.settingForKey('lsToggledOverrides') == 0) ? NSOffState : NSOnState;
    overridesCheckbox.setButtonType(NSSwitchButton);
    overridesCheckbox.setBezelStyle(0);
    overridesCheckbox.setTitle("Symbol Overrides");
    overridesCheckbox.setState(defaultOverrides);

    // Add checkbox
    view.addSubview(artboardsCheckbox);
    view.addSubview(symbolsCheckbox);
    view.addSubview(textLayersCheckbox);
    view.addSubview(shapeLayersCheckbox);
    view.addSubview(overridesCheckbox);


  // Show the dialog window
  return [alert];
}



export function updateSettings() {

  // Set default color for artboard backgrounds
  sketch.Settings.setSettingForKey('lsLightBgColor', ("#" + hexLight.replace('#', '')));
  sketch.Settings.setSettingForKey('lsDarkBgColor', ("#" + hexDark.replace('#', '')));

  // Set toggle for switchable layers
  sketch.Settings.setSettingForKey('lsToggledArtboards', artboardsCheckbox);
  sketch.Settings.setSettingForKey('lsToggledSymbols', symbolsCheckbox);
  sketch.Settings.setSettingForKey('lsToggledTextLayers', textLayersCheckbox);
  sketch.Settings.setSettingForKey('lsToggledShapes', shapeLayersCheckbox);
  sketch.Settings.setSettingForKey('lsToggledOverrides', overridesCheckbox);
}

export function resetSettings() {
  sketch.Settings.setSettingForKey('lsLightBgColor', '#ffffff');
  sketch.Settings.setSettingForKey('lsDarkBgColor', '#000000');

  sketch.Settings.setSettingForKey('lsToggledArtboards', 1);
  sketch.Settings.setSettingForKey('lsToggledSymbols', 1);
  sketch.Settings.setSettingForKey('lsToggledTextLayers', 1);
  sketch.Settings.setSettingForKey('lsToggledShapes', 1);
  sketch.Settings.setSettingForKey('lsToggledOverrides', 1);
}
