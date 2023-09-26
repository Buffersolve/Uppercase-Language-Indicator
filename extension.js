import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';
import {
    Extension
} from 'resource:///org/gnome/shell/extensions/extension.js';

var UppercaseLangIndicator = GObject.registerClass({
    GTypeName: 'UppercaseLangIndicator',
}, class UppercaseLangIndicator extends GObject.Object {
    constructor() {
        super();
        this._keyboard = Main.panel.statusArea.keyboard;
        this._signalId = 0;
        this._originalIndicatorTexts = [];
    }

    enable() {
        this._signalId = this._keyboard._inputSourceManager.connect('current-source-changed', this._updateIndicator.bind(this));
        this._updateIndicator();
    }

    disable() {
        if (this._signalId) {
            this._keyboard._inputSourceManager.disconnect(this._signalId);
            this._signalId = 0;
            this._restoreIndicator();
        }
    }

    _updateIndicator() {
        let source = this._keyboard._inputSourceManager.currentSource;

        if (source) {
            let shortName = source.shortName.toUpperCase();
            let children = this._keyboard._container.get_children();
            for (let i = 0; i < children.length; i++) {
                let child = this._keyboard._container.get_children()[i];
                if (this._originalIndicatorTexts[i] === undefined) {
                    this._originalIndicatorTexts[i] = child.get_text();
                }
                child.set_text(shortName);
            }
        }
    }

    _restoreIndicator() {
        let children = this._keyboard._container.get_children();
        for (let i = 0; i < children.length; i++) {
            if (this._originalIndicatorTexts[i] !== undefined) {
                this._keyboard._container.get_children()[i].set_text(this._originalIndicatorTexts[i]);
            }
        }
        this._originalIndicatorTexts = [];
    }
});

let _indicator;

export default class UppercaseLangIndicatorExtension extends Extension {
    enable() {
        _indicator = new UppercaseLangIndicator();
        _indicator.enable();
    }

    disable() {
        _indicator.disable();
        _indicator = null;
    }
}