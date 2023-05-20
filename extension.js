const Main = imports.ui.main;
const Lang = imports.lang;

var UppercaseLangIndicator = new Lang.Class({
    Name: 'UppercaseLangIndicator',

    _init: function() {
        this._keyboard = Main.panel.statusArea.keyboard;
        this._signalId = 0;
    },

    enable: function() {
        this._signalId = this._keyboard._inputSourceManager.connect('current-source-changed', Lang.bind(this, this._updateIndicator));
        this._updateIndicator();
    },

    disable: function() {
        if (this._signalId) {
            this._keyboard._inputSourceManager.disconnect(this._signalId);
            this._signalId = 0;
        }
    },

    _updateIndicator: function() {
        let source = this._keyboard._inputSourceManager.currentSource;

        if (source) {
            let shortName = source.shortName.toUpperCase();
            let children = this._keyboard._container.get_children();
            for (let i = 0; i < children.length; i++) {
                this._keyboard._container.get_children()[i].set_text(shortName);
            }
        
        }
    },
});

let _indicator;

function init() {
    _indicator = new UppercaseLangIndicator();
}

function enable() {
    _indicator.enable();
}

function disable() {
    _indicator.disable();
}