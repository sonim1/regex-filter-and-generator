'use babel';

import RegexFilterAndGeneratorView from './regex-filter-and-generator-view';
import {CompositeDisposable} from 'atom';
import fs from 'fs';

export default {
    regexFilterAndGeneratorView : null,
    subscriptions : null,
    config : {
        "BackgroundColor": {
            "description": "Marker Background Color - (HexCode)",
            "type": "color",
            "default": "rgba(31, 134, 63, 0.73)"
        }
    },

    activate(state) {
        let callback = {
            closePannel: this.closePannel.bind(this)
        }
        this.regexFilterAndGeneratorView = new RegexFilterAndGeneratorView(state.regexFilterAndGeneratorViewState, callback);
        this.toggleToPannel = atom.workspace.addBottomPanel({item: this.regexFilterAndGeneratorView.getElement(), visible: false});

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'regex-filter-and-generator:toggle': () => this.toggle()
        }));

        //init color
        let config_marker_color = atom.config.get('regex-filter-and-generator.BackgroundColor');
        this.markerBackgroundColorChange(config_marker_color);

        //set color
        atom.config.onDidChange('regex-filter-and-generator.BackgroundColor', ({oldValue, newValue}) => {
            this.markerBackgroundColorChange(newValue);

            //package reload for css update
            this.regexFilterAndGeneratorView.destroy();
            atom.packages.disablePackage('regex-filter-and-generator');
            atom.packages.unloadPackage('regex-filter-and-generator');
            atom.packages.loadPackage('regex-filter-and-generator');
            atom.packages.enablePackage('regex-filter-and-generator');
        });

    },

    deactivate() {
        this.toggleToPannel.destroy();
        this.subscriptions.dispose();
        this.regexFilterAndGeneratorView.destroy();
    },

    serialize() {
        return {regexFilterAndGeneratorViewState: this.regexFilterAndGeneratorView.serialize()};
    },

    toggle() {
        return (this.toggleToPannel.isVisible()
            ? this.closePannel()
            : this.openPannel());
    },

    openPannel() {
        this.toggleToPannel.show();
        this.regexFilterAndGeneratorView.setFocus();
    },

    closePannel() {
        this.toggleToPannel.hide();
        this.regexFilterAndGeneratorView.setText('');
    },

    markerBackgroundColorChange(colorData) {
        let red = colorData._red,
            green = colorData._green,
            blue = colorData._blue,
            alpha = colorData._alpha;
        let color = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
        let css_text = "@marker-background-color: " + color + ";"
        fs.writeFileSync(__dirname + '/../styles/user-variables.less', css_text);
    }
};
