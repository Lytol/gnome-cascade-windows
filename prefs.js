const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const FULLSCREEN_ENABLED_KEY = "fullscreen-enabled";

const Preferences = new Lang.Class({
  Name: 'Preferences',

  _init: function(params) {
    this.settings = Convenience.getSettings();

    this.widget = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      margin: 20
    });

    this.widget.add(this._createSwitch(
      FULLSCREEN_ENABLED_KEY,
      "Cascade fullscreen/maximized windows"
    ));

    this.widget.show_all();
  },

  _createSwitch: function(key, text) {
    let box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    let label = new Gtk.Label({ label: text, halign: Gtk.Align.START });
    let control = new Gtk.Switch({ active: this.settings.get_boolean(key) });

    control.connect('notify::active', Lang.bind(this, function(control) {
      this.settings.set_boolean(key, control.active);
    }));

    box.pack_start(label, true, true, 0);
    box.add(control);
    return box;
  }
});

function init(){

}

function buildPrefsWidget() {
  let preferences = new Preferences();
  return preferences.widget;
}
