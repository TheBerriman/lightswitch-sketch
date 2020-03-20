// import sketch from 'sketch'
const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const selection = document.selectedLayers;
const selectedCount = selection.layers.length;

import { getInputFromUser } from "./settings.js";

// Initialise variables and setup library indexes
var themeSet, themeFrom, setIdx, fromIdx, changeNo = 0;
var librarySymbols = {}, libraryTextStyles = {}, libraryLayerStyles = {};
var librarySymbolRefs = {}, libraryTextRefs = {}, libraryLayerRefs = {};
const libraries = sketch.getLibraries().filter(i => i.enabled && i.valid);
const libraryIds = libraries.map(i => i.id);

// Pull in plugin settings
const defaultBgLight = ((sketch.Settings.settingForKey('lsLightBgColor')) + "ff") || "#ffffffff";
const defaultBgDark = ((sketch.Settings.settingForKey('lsDarkBgColor')) + "ff") || "#000000ff";
const settingArtboards = sketch.Settings.settingForKey('lsToggledArtboards') > 0 ? true : false;
const settingSymbols = sketch.Settings.settingForKey('lsToggledSymbols') > 0 ? true : false;
const settingText = sketch.Settings.settingForKey('lsToggledTextLayers') > 0 ? true : false;
const settingShapes = sketch.Settings.settingForKey('lsToggledShapes') > 0 ? true : false;
const settingOverrides = sketch.Settings.settingForKey('lsToggledOverrides') > 0 ? true : false;


export function setLight () {
  themeSet = 'LIGHT';
  themeFrom = 'DARK';
  setIdx = '1';
  fromIdx = '2';
  if (selectedCount === 0) {
    sketch.UI.message('No layers selected');
  } else {
    selection.forEach(switchThemes);
    feedback('🌕');
  }
}

export function setDark () {
  themeSet = 'DARK';
  themeFrom = 'LIGHT';
  setIdx = '2';
  fromIdx = '1';
  if (selectedCount === 0) {
    sketch.UI.message('No layers selected');
  } else {
    selection.forEach(switchThemes);
    feedback('🌑');
  }
}


// Add specific library references when needed
export function libraryImporter(idx, layerType) {
  var libActive;
  switch (layerType) {
      case ('SymbolMaster'):
        libActive = (librarySymbolRefs[idx]) ? true : false;
        //libActive = (sketch.Settings.sessionVariable('storedLibrarySymbols')[idx]) ? true : false;
        //console.log(libActive);
        if (libActive) return;
        librarySymbols[idx] = libraries[idx].getImportableSymbolReferencesForDocument(document);
        librarySymbolRefs[idx] = librarySymbols[idx].map(i => i.name.toUpperCase().replace(/\s/g,''));
        //sketch.Settings.setSessionVariable('storedLibrarySymbols', librarySymbolRefs);
        //console.log(sketch.Settings.sessionVariable('storedLibrarySymbols').length);
        break;
      case ('Text'):
        libActive = (libraryTextRefs[idx]) ? true : false;
        if (libActive) return;
        libraryTextStyles[idx] = libraries[idx].getImportableTextStyleReferencesForDocument(document);
        libraryTextRefs[idx] = libraryTextStyles[idx].map(i => i.name.toUpperCase().replace(/\s/g,''));
        break;
      case ('ShapePath'):
        libActive = (libraryLayerRefs[idx]) ? true : false;
        if (libActive) return;
        libraryLayerStyles[idx] = libraries[idx].getImportableLayerStyleReferencesForDocument(document);
        libraryLayerRefs[idx] = libraryLayerStyles[idx].map(i => i.name.toUpperCase().replace(/\s/g,''));
        break;
  }
}

export function switchThemes (layer) {

  if (layer.layers && layer.layers.length) {

    // Change Artboard colors from Light to Dark
    if (((layer.type === 'Artboard') || (layer.type === 'SymbolMaster')) && (layer.background.enabled) && (settingArtboards) && ((Boolean(layer.background.color == defaultBgLight)) || (Boolean(layer.background.color == defaultBgDark)))) {
      layer.background.color = (themeSet === 'DARK') ? defaultBgDark : defaultBgLight;
    }


    // iterate through child layers
    layer.layers.forEach(switchThemes);

  } else {

    switch (layer.type) {
      case ('SymbolInstance'):
        if (!settingSymbols) break;
        let newSymbolMaster = symbolParser(layer.master);
        if (!newSymbolMaster) break;
        layer.symbolId = newSymbolMaster.symbolId;
        layer.name = (layer.name.toUpperCase().replace(/\s/g,'').replace(themeFrom, themeSet) == newSymbolMaster.name.toUpperCase().replace(/\s/g,'')) ? newSymbolMaster.name : layer.name;
        changeNo++;
        if (layer.overrides.map(i => i.isDefault).includes(false) && settingOverrides) overrideParser(layer);
        break;
      case ('Text'):
        if (!settingText) break;
        let newSharedTextStyle = textParser(layer.sharedStyle);
        if (!newSharedTextStyle) break;
        layer.sharedStyle = newSharedTextStyle;
        layer.style.syncWithSharedStyle(newSharedTextStyle);
        changeNo++;
        break;
      case ('ShapePath'):
        if (!settingShapes) break;
        let newSharedLayerStyle = shapeParser(layer.sharedStyle);
        if (!newSharedLayerStyle) break;
        layer.sharedStyle = newSharedLayerStyle;
        layer.style.syncWithSharedStyle(newSharedLayerStyle);
        changeNo++;
        break;
      default:
        return;
    }
  }
}

// Iterate through Symbols
export function symbolParser(layerMaster) {

  // Check symbol master is eligible
  if (!layerMaster.name.toUpperCase().includes(themeFrom)) return;

  // Check for enumerated naming - i.e. 1 Light and 2 Dark
  let customFrom = themeFrom;
  let customSet = themeSet;
  if (layerMaster.name.toUpperCase().replace(/\s/g,'').includes(fromIdx + themeFrom)) {
      customFrom = fromIdx + themeFrom;
      customSet = setIdx + themeSet;
  }


  // Create name for inverted symbol master
  let invertedName = layerMaster.name.toUpperCase().replace(/\s/g,'').replace(customFrom, customSet);


  // Search for library symbols
  if (layerMaster.getLibrary() && layerMaster.getLibrary().enabled) {

    // Return matching symbol master from library
    let libraryIndex = libraryIds.indexOf(layerMaster.getLibrary().id);
    libraryImporter(libraryIndex, layerMaster.type);
    let masterIndex = librarySymbolRefs[libraryIndex].indexOf(invertedName);
    if (masterIndex < 0) return;

    return librarySymbols[libraryIndex][masterIndex].import();
    //return libraries[libraryIndex].getImportableSymbolReferencesForDocument(document)[masterIndex].import()

  // Search for local symbols with an inverse counterpart
  } else if (document.getSymbols().filter(i => !i.getLibrary()).find(i => i.name.toUpperCase().replace(/\s/g,'') === invertedName)) {
    // Return local symbol master
    return document.getSymbols().find(i => !i.getLibrary() && i.name.toUpperCase().replace(/\s/g,'') === invertedName);
  }
}

// Iterate through the Overrides of passed Symbol Instance
export function overrideParser(instance) {

  // Filter overrides to just non-defaults + text/layer styles
  var filteredOverrides = instance.overrides.filter(i => !i.isDefault && /^(layerStyle|textStyle)$/.test(i.property));

  // Iterate through filtered overrides and reset values
  filteredOverrides.forEach((override, index) => {
    let instanceId = instance.overrides.map(i => i.id).indexOf(override.id);
    let masterId = instance.master.overrides.map(i => i.id).indexOf(override.id);
    let masterCorrected = (masterId >= 0) ? masterId : 0;

    let defaultMasterValue = instance.master.overrides[masterCorrected].value;
    instance.setOverrideValue(instance.overrides[instanceId], defaultMasterValue);
  });

}


// Iterate through Shared Text Styles
export function textParser(layerStyle) {

  // Check shared text-style is eligible
  if (!layerStyle) return;
  if (!layerStyle.name.toUpperCase().includes(themeFrom)) return;

  // Check for enumerated naming - i.e. 1 Light and 2 Dark
  let customFrom = themeFrom;
  let customSet = themeSet;
  if (layerStyle.name.toUpperCase().replace(/\s/g,'').includes(fromIdx + themeFrom)) {
      customFrom = fromIdx + themeFrom;
      customSet = setIdx + themeSet;
  }
  //

  // Create inverted shared-style name
  let invertedTextStyleName = layerStyle.name.toUpperCase().replace(/\s/g,'').replace(customFrom, customSet);

  // Search for library text-styles
  if (layerStyle.getLibrary() && layerStyle.getLibrary().enabled) {

    // Return matching Text Styles from library
    let libraryIndex = libraryIds.indexOf(layerStyle.getLibrary().id);
    libraryImporter(libraryIndex, 'Text');
    let masterIndex = libraryTextRefs[libraryIndex].indexOf(invertedTextStyleName);
    if (masterIndex < 0) return;

    return libraryTextStyles[libraryIndex][masterIndex].import();

  // Search for local text styles with an inverse counterpart
  } else if (document.sharedTextStyles.filter(i => !i.getLibrary()).find(i => i.name.toUpperCase().replace(/\s/g,'') === invertedTextStyleName)) {
      // Return local shared text-style
      return document.sharedTextStyles.find(i => !i.getLibrary() && i.name.toUpperCase().replace(/\s/g,'') === invertedTextStyleName);
  }
}


// Iterate through Shared Layer Styles
export function shapeParser(layerStyle) {
  // Check shared layer-style is eligible
  if (!layerStyle) return;
  if (!layerStyle.name.toUpperCase().includes(themeFrom)) return;

  // Check for iOS UI kit exceptions
  let customFrom = themeFrom;
  let customSet = themeSet;
  if ((layerStyle.name.includes('iOS System Backgrounds')) && (themeSet === 'DARK')) {
        customSet = 'DARK - BASE';
  } else if ((layerStyle.name.includes('iOS System Backgrounds')) && (themeSet === 'LIGHT')) {
        customFrom = 'DARK - BASE';
  } else if (layerStyle.name.toUpperCase().replace(/\s/g,'').includes(fromIdx + themeFrom)) {
      customFrom = fromIdx + themeFrom;
      customSet = setIdx + themeSet;
  }
  //

  // Create inverted shared style name
  let invertedLayerStyleName = layerStyle.name.toUpperCase().replace(/\s/g,'').replace(customFrom, customSet);

  // Search for library layer-styles
  if (layerStyle.getLibrary() && layerStyle.getLibrary().enabled) {

    // Return matching Text Styles from library
    let libraryIndex = libraryIds.indexOf(layerStyle.getLibrary().id);
    libraryImporter(libraryIndex, 'ShapePath');
    let masterIndex = libraryLayerRefs[libraryIndex].indexOf(invertedLayerStyleName);
    if (masterIndex < 0) return;

    return libraryLayerStyles[libraryIndex][masterIndex].import();

  // Search for local layer styles with an inverse counterpart
  } else if (document.sharedLayerStyles.filter(i => !i.getLibrary()).find(i => i.name.toUpperCase().replace(/\s/g,'') === invertedLayerStyleName)) {

      // Return local shared text style
      return document.sharedLayerStyles.find(i => !i.getLibrary() && i.name.toUpperCase().replace(/\s/g,'') === invertedLayerStyleName);
  }
}

export function feedback (themeEmoji) {
  if (changeNo > 0) {
    sketch.UI.message(`${themeEmoji} ${changeNo} layers converted to ${themeSet} mode`);
    context.document.reloadInspector();
} else {
    sketch.UI.message('No eligible layers selected');
  }
}
