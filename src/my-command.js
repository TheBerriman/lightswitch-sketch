// import sketch from 'sketch'
const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const selection = document.selectedLayers;
const selectedCount = selection.layers.length;


// find and import valid libraries
var librarySymbols = {};
var libraryTextStyles = {};
var libraryLayerStyles = {};
var libraries = sketch.getLibraries().filter(i => i.enabled && i.valid);
libraries.forEach((library, idx) => {
  librarySymbols[idx] = library.getImportableSymbolReferencesForDocument(document);
  libraryTextStyles[idx] = library.getImportableTextStyleReferencesForDocument(document);
  libraryLayerStyles[idx] = library.getImportableLayerStyleReferencesForDocument(document);
});


var themeSet;
var themeFrom;
var setIdx;
var fromIdx;
var changeNo = 0;

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


export function switchThemes (layer) {

  // Change Artboard colors from Light to Dark
  if ((layer.type === 'Artboard') && (layer.background.enabled) && (Boolean(layer.background.color.match(/^(#ffffffff|#000000ff)$/)))) {
    layer.background.color = (themeSet === 'DARK') ? '#000000ff' : '#ffffffff';
  }

  if (layer.layers && layer.layers.length) {

    // iterate through child layers
    layer.layers.forEach(switchThemes);

  } else {

    switch (layer.type) {
      case ('SymbolInstance'):
        let newSymbolMaster = symbolParser(layer);
        if (!newSymbolMaster) break;
        layer.symbolId = newSymbolMaster.symbolId;
        layer.name = newSymbolMaster.name;
        changeNo++;
        break;
      case ('Text'):
        let newSharedTextStyle = textParser(layer);
        if (!newSharedTextStyle) break;
        layer.sharedStyle = newSharedTextStyle;
        layer.style.syncWithSharedStyle(newSharedTextStyle);
        changeNo++;
        break;
      case ('ShapePath'):
        let newSharedLayerStyle = shapeParser(layer);
        if (!newSharedLayerStyle) break;
        layer.sharedStyle = newSharedLayerStyle;
        layer.style.syncWithSharedStyle(newSharedLayerStyle);
        changeNo++;
        break;
    }
  }
}

// Iterate through Symbols
export function symbolParser(layer) {
  // Check symbol master is eligible
  if (!layer.master.name.toUpperCase().includes(themeFrom)) return;

  // Create name for inverted symbol master
  let invertedName = layer.master.name.toUpperCase().replace(themeFrom, themeSet);

  // Search for library symbols
  if (layer.master.getLibrary() && layer.master.getLibrary().enabled) {

    // Return matching symbol master from library
    let libraryIndex = libraries.findIndex(i => i.name === layer.master.getLibrary().name);
    if (!librarySymbols[libraryIndex].find(i => i.name.toUpperCase() === invertedName)) return;
    return librarySymbols[libraryIndex].find(i => i.name.toUpperCase() === invertedName).import();

  // Search for local symbols with an inverse counterpart
  } else if (document.getSymbols().filter(i => !i.getLibrary()).find(i => i.name.toUpperCase() === invertedName)) {
    // Return local symbol master
    return document.getSymbols().find(i => !i.getLibrary() && i.name.toUpperCase() === invertedName);
  }
}


// Iterate through Shared Text Styles
export function textParser(layer) {
  // Check shared text-style is eligible
  if (!layer.sharedStyle) return;
  if (!layer.sharedStyle.name.toUpperCase().includes(themeFrom)) return;


  // Check for iOS UI kit exceptions
  let customFrom = themeFrom;
  let customSet = themeSet;
  if (layer.sharedStyle.name.toUpperCase().includes(fromIdx + ' ' + themeFrom)) {
      customFrom = fromIdx + ' ' + themeFrom;
      customSet = setIdx + ' ' + themeSet;
  }
  //

  // Create inverted shared-style name
  let invertedTextStyleName = layer.sharedStyle.name.toUpperCase().replace(customFrom, customSet);

  // Search for library text-styles
  if (layer.sharedStyle.getLibrary() && layer.sharedStyle.getLibrary().enabled) {
    // Return matching Text Styles from library
    let libraryIndex = libraries.findIndex(i => i.name === layer.sharedStyle.getLibrary().name);
    if (!libraryTextStyles[libraryIndex].find(i => i.name.toUpperCase() === invertedTextStyleName)) return;
    return libraryTextStyles[libraryIndex].find(i => i.name.toUpperCase() === invertedTextStyleName).import();

  // Search for local text styles with an inverse counterpart
  } else if (document.sharedTextStyles.filter(i => !i.getLibrary()).find(i => i.name.toUpperCase() === invertedTextStyleName)) {
      // Return local shared text-style
      return document.sharedTextStyles.find(i => !i.getLibrary() && i.name.toUpperCase() === invertedTextStyleName);
  }
}


// Iterate through Shared Layer Styles
export function shapeParser(layer) {
  // Check shared layer-style is eligible
  if (!layer.sharedStyle) return;
  if (!layer.sharedStyle.name.toUpperCase().includes(themeFrom)) return;

  // Check for iOS UI kit exceptions
  let customFrom = themeFrom;
  let customSet = themeSet;
  if ((layer.sharedStyle.name.includes('iOS System Backgrounds')) && (themeSet === 'DARK')) {
        customSet = 'DARK - BASE';
  } else if ((layer.sharedStyle.name.includes('iOS System Backgrounds')) && (themeSet === 'LIGHT')) {
        customFrom = 'DARK - BASE';
  }
  //

  // Create inverted shared style name
  let invertedLayerStyleName = layer.sharedStyle.name.toUpperCase().replace(customFrom, customSet);

  // Search for library layer-styles
  if (layer.sharedStyle.getLibrary() && layer.sharedStyle.getLibrary().enabled) {
    // Return matching layer-styles from library
    let libraryIndex = libraries.findIndex(i => i.name === layer.sharedStyle.getLibrary().name);
    if (!libraryLayerStyles[libraryIndex].find(i => i.name.toUpperCase() === invertedLayerStyleName)) return;
    return libraryLayerStyles[libraryIndex].find(i => i.name.toUpperCase() === invertedLayerStyleName).import();

  // Search for local layer styles with an inverse counterpart
  } else if (document.sharedLayerStyles.filter(i => !i.getLibrary()).find(i => i.name.toUpperCase() === invertedLayerStyleName)) {
      // Return local shared text style
      return document.sharedLayerStyles.find(i => !i.getLibrary() && i.name.toUpperCase() === invertedLayerStyleName);
  }
}

export function feedback (themeEmoji) {
  if (changeNo > 0) {
    sketch.UI.message(themeEmoji + ' ' + changeNo + ' layers converted to ' + themeSet + ' mode');
    context.document.reloadInspector();
} else {
    sketch.UI.message('No eligible layers selected');
  }
}
