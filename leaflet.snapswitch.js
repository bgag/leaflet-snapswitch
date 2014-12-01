/* global L:true */

'use strict';


/**
 * Handler to switch editing mode between simple (Leaflet-Draw) and snap (Leaflet-Snap)
 */
L.Edit.PolylineSnapSwitch = L.Handler.extend({
  initialize: function (map, guide, layer) {
    this._enabled = false;

    if ('editing' in layer) {
      this._simpleEditing = layer.editing;
    } else {
      this._simpleEditing = new L.Draw.Polyline(map);
    }

    this._snapEditing = new L.Handler.PolylineSnap(map, layer);
    this._snapEditing.addGuideLayer(guide);

    this._selectedHandler = this._simpleEditing;
  },
  enabled: function () {
    return this._enabled;
  },
  enable: function () {
    this._enabled = true;
    this._selectedHandler.enable();
  },
  disable: function () {
    this._enabled = false;
    this._selectedHandler.disable();
  },
  snap: function (enableSnap) {
    var selectedHandler = enableSnap ? this._snapEditing : this._simpleEditing;

    if (this._enabled && selectedHandler !== this._selectedHandler) {
      this._selectedHandler.disable();
      selectedHandler.enable();
    }

    this._selectedHandler = selectedHandler;
  }
});