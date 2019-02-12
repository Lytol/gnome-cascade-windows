const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const WorkspaceManager = global.screen || global.workspace_manager;
const Convenience = Me.imports.convenience;

let cascader, button, settings;

const GUTTER_SIZE = 50;
const KEY_BINDING_KEY = "cascade-windows";
const FULLSCREEN_ENABLED_KEY = "fullscreen-enabled";

const WindowCascader = new Lang.Class({
  Name: "WindowCascader.WindowCascader",

  _init: function() {},

  cascade: function() {
    let windows = this._cascadableWindows();

    for(let i = 0; i < windows.length; i++) {
      this._updateWindow(windows[i], i);
    }
  },

  _primaryMonitor: function() {
      return Main.layoutManager.primaryMonitor.index;
  },

  _currentWorkspace: function() {
    return WorkspaceManager.get_active_workspace();
  },

  _workArea: function() {
    return this._currentWorkspace().get_work_area_for_monitor(this._primaryMonitor());
  },

  _gutterWidth: function() {
    return GUTTER_SIZE;
  },

  _gutterHeight: function() {
    return GUTTER_SIZE;
  },

  _cascadableWindows: function() {
    let windows = [];
    let windowActors = global.get_window_actors();

    for (let i = 0; i < windowActors.length; i++) {
      let win = windowActors[i].meta_window;

      if (this._isCascadable(win)) {
        windows.push(win);
      }
    }

    return windows;
  },

  _isCascadable: function(win) {
    if (win.is_on_all_workspaces()) {
      return false;
    }

    if (win.get_monitor() != this._primaryMonitor()) {
      return false;
    }

    if (!win.located_on_workspace(this._currentWorkspace())) {
      return false;
    }

    return true;
  },

  _updateWindow: function(win, idx) {
    let x = ((idx+1) * this._gutterWidth()) + this._workArea().x;
    let y = ((idx+1) * this._gutterHeight()) + this._workArea().y;
    let width = this._workArea().width - ((this._cascadableWindows().length + 1) * this._gutterWidth());
    let height = this._workArea().height - ((this._cascadableWindows().length + 1) * this._gutterHeight());

    if (this._includeFullscreen()) {
      win.unmaximize(Meta.MaximizeFlags.BOTH);
    }

    win.move_resize_frame(false, x, y, width, height);
  },

  _includeFullscreen: function() {
    return settings.get_boolean(FULLSCREEN_ENABLED_KEY);
  }
});

function _cascade() {
  if (cascader !== null) {
    cascader.cascade();
  }
}

function init() {
  settings = Convenience.getSettings();

  button = new St.Bin({
    style_class: 'panel-button',
    reactive: true,
    can_focus: true,
    x_fill: true,
    y_fill: false,
    track_hover: true });

  let icon = new St.Icon({
    icon_name: 'view-paged-symbolic',
    style_class: 'system-status-icon' });

  button.set_child(icon);
  button.connect('button-press-event', _cascade);
}

function enable() {
  cascader = new WindowCascader();

  Main.panel._rightBox.insert_child_at_index(button, 0);

  Main.wm.addKeybinding(
    KEY_BINDING_KEY,
    settings,
    Meta.KeyBindingFlags.NONE,
    Shell.ActionMode.NORMAL,
    _cascade
  );
}

function disable() {
  cascader = null;
  Main.panel._rightBox.remove_child(button);
}
