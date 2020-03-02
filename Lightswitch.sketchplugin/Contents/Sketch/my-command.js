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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: setLight, setDark, switchThemes, symbolParser, textParser, shapeParser, feedback */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setLight", function() { return setLight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDark", function() { return setDark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchThemes", function() { return switchThemes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "symbolParser", function() { return symbolParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textParser", function() { return textParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shapeParser", function() { return shapeParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "feedback", function() { return feedback; });
// import sketch from 'sketch'
var sketch = __webpack_require__(/*! sketch */ "sketch");

var document = sketch.getSelectedDocument();
var selection = document.selectedLayers;
var selectedCount = selection.layers.length; // find and import valid libraries

var librarySymbols = {};
var libraryTextStyles = {};
var libraryLayerStyles = {};
var libraries = sketch.getLibraries().filter(function (i) {
  return i.enabled && i.valid;
});
libraries.forEach(function (library, idx) {
  librarySymbols[idx] = library.getImportableSymbolReferencesForDocument(document);
  libraryTextStyles[idx] = library.getImportableTextStyleReferencesForDocument(document);
  libraryLayerStyles[idx] = library.getImportableLayerStyleReferencesForDocument(document);
});
var themeSet;
var themeFrom;
var setIdx;
var fromIdx;
var changeNo = 0;
function setLight() {
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
function setDark() {
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
function switchThemes(layer) {
  // Change Artboard colors from Light to Dark
  if (layer.type === 'Artboard' && layer.background.enabled && Boolean(layer.background.color.match(/^(#ffffffff|#000000ff)$/))) {
    layer.background.color = themeSet === 'DARK' ? '#000000ff' : '#ffffffff';
  }

  if (layer.layers && layer.layers.length) {
    // iterate through child layers
    layer.layers.forEach(switchThemes);
  } else {
    switch (layer.type) {
      case 'SymbolInstance':
        var newSymbolMaster = symbolParser(layer);
        if (!newSymbolMaster) break;
        layer.symbolId = newSymbolMaster.symbolId;
        layer.name = newSymbolMaster.name;
        changeNo++;
        break;

      case 'Text':
        var newSharedTextStyle = textParser(layer);
        if (!newSharedTextStyle) break;
        layer.sharedStyle = newSharedTextStyle;
        layer.style.syncWithSharedStyle(newSharedTextStyle);
        changeNo++;
        break;

      case 'ShapePath':
        var newSharedLayerStyle = shapeParser(layer);
        if (!newSharedLayerStyle) break;
        layer.sharedStyle = newSharedLayerStyle;
        layer.style.syncWithSharedStyle(newSharedLayerStyle);
        changeNo++;
        break;
    }
  }
} // Iterate through Symbols

function symbolParser(layer) {
  // Check symbol master is eligible
  if (!layer.master.name.toUpperCase().includes(themeFrom)) return; // Create name for inverted symbol master

  var invertedName = layer.master.name.toUpperCase().replace(themeFrom, themeSet); // Search for library symbols

  if (layer.master.getLibrary() && layer.master.getLibrary().enabled) {
    // Return matching symbol master from library
    var libraryIndex = libraries.findIndex(function (i) {
      return i.name === layer.master.getLibrary().name;
    });
    if (!librarySymbols[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedName;
    })) return;
    return librarySymbols[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedName;
    }).import(); // Search for local symbols with an inverse counterpart
  } else if (document.getSymbols().filter(function (i) {
    return !i.getLibrary();
  }).find(function (i) {
    return i.name.toUpperCase() === invertedName;
  })) {
    // Return local symbol master
    return document.getSymbols().find(function (i) {
      return !i.getLibrary() && i.name.toUpperCase() === invertedName;
    });
  }
} // Iterate through Shared Text Styles

function textParser(layer) {
  // Check shared text-style is eligible
  if (!layer.sharedStyle) return;
  if (!layer.sharedStyle.name.toUpperCase().includes(themeFrom)) return; // Check for iOS UI kit exceptions

  var customFrom = themeFrom;
  var customSet = themeSet;

  if (layer.sharedStyle.name.toUpperCase().includes(fromIdx + ' ' + themeFrom)) {
    customFrom = fromIdx + ' ' + themeFrom;
    customSet = setIdx + ' ' + themeSet;
  } //
  // Create inverted shared-style name


  var invertedTextStyleName = layer.sharedStyle.name.toUpperCase().replace(customFrom, customSet); // Search for library text-styles

  if (layer.sharedStyle.getLibrary() && layer.sharedStyle.getLibrary().enabled) {
    // Return matching Text Styles from library
    var libraryIndex = libraries.findIndex(function (i) {
      return i.name === layer.sharedStyle.getLibrary().name;
    });
    if (!libraryTextStyles[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedTextStyleName;
    })) return;
    return libraryTextStyles[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedTextStyleName;
    }).import(); // Search for local text styles with an inverse counterpart
  } else if (document.sharedTextStyles.filter(function (i) {
    return !i.getLibrary();
  }).find(function (i) {
    return i.name.toUpperCase() === invertedTextStyleName;
  })) {
    // Return local shared text-style
    return document.sharedTextStyles.find(function (i) {
      return !i.getLibrary() && i.name.toUpperCase() === invertedTextStyleName;
    });
  }
} // Iterate through Shared Layer Styles

function shapeParser(layer) {
  // Check shared layer-style is eligible
  if (!layer.sharedStyle) return;
  if (!layer.sharedStyle.name.toUpperCase().includes(themeFrom)) return; // Check for iOS UI kit exceptions

  var customFrom = themeFrom;
  var customSet = themeSet;

  if (layer.sharedStyle.name.includes('iOS System Backgrounds') && themeSet === 'DARK') {
    customSet = 'DARK - BASE';
  } else if (layer.sharedStyle.name.includes('iOS System Backgrounds') && themeSet === 'LIGHT') {
    customFrom = 'DARK - BASE';
  } //
  // Create inverted shared style name


  var invertedLayerStyleName = layer.sharedStyle.name.toUpperCase().replace(customFrom, customSet); // Search for library layer-styles

  if (layer.sharedStyle.getLibrary() && layer.sharedStyle.getLibrary().enabled) {
    // Return matching layer-styles from library
    var libraryIndex = libraries.findIndex(function (i) {
      return i.name === layer.sharedStyle.getLibrary().name;
    });
    if (!libraryLayerStyles[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedLayerStyleName;
    })) return;
    return libraryLayerStyles[libraryIndex].find(function (i) {
      return i.name.toUpperCase() === invertedLayerStyleName;
    }).import(); // Search for local layer styles with an inverse counterpart
  } else if (document.sharedLayerStyles.filter(function (i) {
    return !i.getLibrary();
  }).find(function (i) {
    return i.name.toUpperCase() === invertedLayerStyleName;
  })) {
    // Return local shared text style
    return document.sharedLayerStyles.find(function (i) {
      return !i.getLibrary() && i.name.toUpperCase() === invertedLayerStyleName;
    });
  }
}
function feedback(themeEmoji) {
  if (changeNo > 0) {
    sketch.UI.message(themeEmoji + ' ' + changeNo + ' layers converted to ' + themeSet + ' mode');
    context.document.reloadInspector();
  } else {
    sketch.UI.message('No eligible layers selected');
  }
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
globalThis['setLight'] = __skpm_run.bind(this, 'setLight');
globalThis['onRun'] = __skpm_run.bind(this, 'default');
globalThis['setDark'] = __skpm_run.bind(this, 'setDark')

//# sourceMappingURL=my-command.js.map