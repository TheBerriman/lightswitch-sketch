var globalThis = this;
function __skpm_run (key, context) {
  globalThis.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/settings.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/*! exports provided: getInputFromUser, createWindow, updateSettings, resetSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInputFromUser", function() { return getInputFromUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createWindow", function() { return createWindow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateSettings", function() { return updateSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetSettings", function() { return resetSettings; });
var sketch = __webpack_require__(/*! sketch */ "sketch");

var document = sketch.getSelectedDocument();
var page = document.selectedPage;
var selection = document.selectedLayers;
var textFieldLight, textFieldDark;
var hexLight, hexDark;
var artboardsCheckbox, symbolsCheckbox, textLayersCheckbox, shapeLayersCheckbox, overridesCheckbox;
function getInputFromUser(context) {
  // Create and show dialog window
  var window = createWindow(context);
  var alert = window[0];
  var response = alert.runModal();

  if (response == "1000") {
    // Artboard background colours
    hexLight = textFieldLight.stringValue();
    hexDark = textFieldDark.stringValue(); // Validate colours for valid hex strings

    if (!/^[0-9A-F]{6}$/i.test(hexLight.trim().replace('#', '')) || !/^[0-9A-F]{6}$/i.test(hexDark.trim().replace('#', ''))) {
      sketch.UI.alert('Cannot Save Changes', 'Invalid background color entered for Artboards');
      getInputFromUser();
      return;
    } // Toggle checkboxes


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
function createWindow() {
  var alert = COSAlertWindow.new(); //alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed('icon.png').path()));

  alert.setMessageText("Light Switch Settings"); // Creating dialog buttons

  alert.addButtonWithTitle("Save");
  alert.addButtonWithTitle("Reset");
  alert.addButtonWithTitle("Cancel"); // Creating the view

  var viewWidth = 300;
  var viewHeight = 205;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view); // Create and configure your inputs here
  // ...
  // Create labels

  var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 52, viewWidth - 30, 55));
  var lightBgLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 105, viewWidth - 30, 55));
  var darkBgLabel = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 105, viewWidth - 30, 55));
  var toggleLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 163, viewWidth - 30, 55)); // Configure labels

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
  toggleLabel.setDrawsBackground(false); // Add labels to window

  view.addSubview(infoLabel);
  view.addSubview(lightBgLabel);
  view.addSubview(darkBgLabel);
  view.addSubview(toggleLabel); // Create text fields

  textFieldLight = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 90, 120, 20));
  textFieldDark = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 90, 120, 20)); // Optional: Make TAB key work to switch between textfields
  //[textFieldLight setNextKeyView:textFieldDark];
  //[textFieldDark setNextKeyView:textFieldLight];
  // Add text fields to window

  view.addSubview(textFieldLight);
  view.addSubview(textFieldDark); // Default text values

  var defaultLightBg = sketch.Settings.settingForKey('lsLightBgColor') || '#ffffff';
  var defaultDarkBg = sketch.Settings.settingForKey('lsDarkBgColor') || '#000000';
  textFieldLight.setStringValue(defaultLightBg);
  textFieldDark.setStringValue(defaultDarkBg); // Create checkbox

  artboardsCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 150, viewWidth - viewSpacer, 20));
  symbolsCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(140, viewHeight - 150, viewWidth - viewSpacer, 20));
  textLayersCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 172.5, viewWidth - viewSpacer, 20));
  shapeLayersCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(140, viewHeight - 172.5, viewWidth - viewSpacer, 20));
  overridesCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 195, viewWidth - viewSpacer, 20)); // Configure checkboxes

  var defaultArtboard = sketch.Settings.settingForKey('lsToggledArtboards') == 0 ? NSOffState : NSOnState;
  artboardsCheckbox.setButtonType(NSSwitchButton);
  artboardsCheckbox.setBezelStyle(0);
  artboardsCheckbox.setTitle("Artboards");
  artboardsCheckbox.setState(defaultArtboard);
  var defaultSymbols = sketch.Settings.settingForKey('lsToggledSymbols') == 0 ? NSOffState : NSOnState;
  symbolsCheckbox.setButtonType(NSSwitchButton);
  symbolsCheckbox.setBezelStyle(0);
  symbolsCheckbox.setTitle("Symbols");
  symbolsCheckbox.setState(defaultSymbols);
  var defaultTextLayers = sketch.Settings.settingForKey('lsToggledTextLayers') == 0 ? NSOffState : NSOnState;
  textLayersCheckbox.setButtonType(NSSwitchButton);
  textLayersCheckbox.setBezelStyle(0);
  textLayersCheckbox.setTitle("Text Styles");
  textLayersCheckbox.setState(defaultTextLayers);
  var defaultShapes = sketch.Settings.settingForKey('lsToggledShapes') == 0 ? NSOffState : NSOnState;
  shapeLayersCheckbox.setButtonType(NSSwitchButton);
  shapeLayersCheckbox.setBezelStyle(0);
  shapeLayersCheckbox.setTitle("Shape Styles");
  shapeLayersCheckbox.setState(defaultShapes);
  var defaultOverrides = sketch.Settings.settingForKey('lsToggledOverrides') == 0 ? NSOffState : NSOnState;
  overridesCheckbox.setButtonType(NSSwitchButton);
  overridesCheckbox.setBezelStyle(0);
  overridesCheckbox.setTitle("Symbol Overrides");
  overridesCheckbox.setState(defaultOverrides); // Add checkbox

  view.addSubview(artboardsCheckbox);
  view.addSubview(symbolsCheckbox);
  view.addSubview(textLayersCheckbox);
  view.addSubview(shapeLayersCheckbox);
  view.addSubview(overridesCheckbox); // Show the dialog window

  return [alert];
}
function updateSettings() {
  // Set default color for artboard backgrounds
  sketch.Settings.setSettingForKey('lsLightBgColor', "#" + hexLight.replace('#', ''));
  sketch.Settings.setSettingForKey('lsDarkBgColor', "#" + hexDark.replace('#', '')); // Set toggle for switchable layers

  sketch.Settings.setSettingForKey('lsToggledArtboards', artboardsCheckbox);
  sketch.Settings.setSettingForKey('lsToggledSymbols', symbolsCheckbox);
  sketch.Settings.setSettingForKey('lsToggledTextLayers', textLayersCheckbox);
  sketch.Settings.setSettingForKey('lsToggledShapes', shapeLayersCheckbox);
  sketch.Settings.setSettingForKey('lsToggledOverrides', overridesCheckbox);
}
function resetSettings() {
  sketch.Settings.setSettingForKey('lsLightBgColor', '#ffffff');
  sketch.Settings.setSettingForKey('lsDarkBgColor', '#000000');
  sketch.Settings.setSettingForKey('lsToggledArtboards', 1);
  sketch.Settings.setSettingForKey('lsToggledSymbols', 1);
  sketch.Settings.setSettingForKey('lsToggledTextLayers', 1);
  sketch.Settings.setSettingForKey('lsToggledShapes', 1);
  sketch.Settings.setSettingForKey('lsToggledOverrides', 1);
}

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else if (typeof exports[key] !== 'function') {
    throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
  } else {
    exports[key](context);
  }
}
globalThis['getInputFromUser'] = __skpm_run.bind(this, 'getInputFromUser');
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=settings.js.map