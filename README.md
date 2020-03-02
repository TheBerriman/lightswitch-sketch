# Lightswitch Sketch Plugin

![GIF of Lightswitch usage](./assets/documentation-images/lightswitch-plugin-icon.png "GIF of Lightswitch usage")

Lightswitch is a plugin for Sketch that speeds up conversion between Light/Dark symbols, text styles and layer styles across your screens.

# Installation

1. [Download](../../releases/latest/download/Lightswitch.sketchplugin.zip) the latest release of the plugin
2. Un-zip
3. Double-click on Lightswitch.sketchplugin

# Usage

Select any eligible layers you want switched to their light or dark counterparts and run one of the commands below.

| Menu                          | Shortcut                          | Description                                             |
| ------------------------------| ----------------------------------| --------------------------------------------------------|
| Toggle Light Styles           | `⌘ command` + `⌥ option` + `k`    | Switch selected layers to available *light* alternatives|
| Toggle Dark Styles            | `⌘ command` + `⌥ option` + `l`    | Switch selected layers to available *dark* alternatives |



# How it works

Lightswitch takes your currently selected layers and then finds what Sketch Library they came from. If found, it then searches for the library for an alternative theme equivalent for each `Symbol`, `Text Style` or `Layer Style`.

For example running the command on the symbol instance...
> Bars / Navigation Bar / iPhone - Compact / Light / Large Title

...would convert it into
> Bars / Navigation Bar / iPhone - Compact / Dark / Large Title



# Upcoming Features
- Ability to configure background colours
- Toggle Symbols, Overrides, Layer Styles or Text styles on/off
- Support for custom naming such as `1 Light` = `2 Dark`



# Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._



# Contact

* Message through Github [@TheBerriman] (https://github.com/TheBerriman)
* Message through Dribbble [@SamBerriman](https://dribbble.com/samberriman)
