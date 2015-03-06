/* global L:true */

'use strict';


/**
 * Wrapper to support GroupLayers
 */
L.Edit.GroupLayerSnapSwitch = L.Handler.extend({
  initialize: function (map, guide, layer) {
    this._enabled = false;
    this._layer = layer;

    this._layer.eachLayer(function (subLayer) {
      subLayer.editing = new L.Edit.PolylineSnapSwitch(map, guide, subLayer);
    });
  },
  enabled: function () {
    return this._enabled;
  },
  enable: function () {
    this._enabled = true;

    this._layer.eachLayer(function (subLayer) {
      subLayer.editing.enable();
    });
  },
  disable: function () {
    this._enabled = false;

    this._layer.eachLayer(function (subLayer) {
      subLayer.editing.disable();
    });
  },
  snap: function (enableSnap) {
    this._layer.eachLayer(function (subLayer) {
      subLayer.editing.snap(enableSnap);
    });
  }
});


/**
 * Handler to switch editing mode between simple (Leaflet-Draw) and snap (Leaflet-Snap)
 */
L.Edit.PolylineSnapSwitch = L.Handler.extend({
  initialize: function (map, guide, layer) {
    this._enabled = false;
    this._layer = layer;

    if ('_layers' in layer) {
      // always use the same handler
      this._snapEditing = this._simpleEditing = this._selectedHandler =
        new L.Edit.GroupLayerSnapSwitch(map, guide, layer);

      // and forward .snap calls to the group handler
      this.snap = this._selectedHandler.snap;
    } else {
      if ('editing' in layer) {
        this._simpleEditing = layer.editing;
      } else {
        this._simpleEditing = new L.Draw.Polyline(map);
      }

      this._snapEditing = new L.Handler.PolylineSnap(map, layer);
      this._snapEditing.addGuideLayer(guide);

      this._selectedHandler = this._simpleEditing;
    }
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