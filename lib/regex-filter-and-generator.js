'use babel';

import RegexFilterAndGeneratorView from './regex-filter-and-generator-view';
import {CompositeDisposable} from 'atom';

export default {
    regexFilterAndGeneratorView : null,
    subscriptions : null,

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

    openPannel(){
        this.toggleToPannel.show();
        this.regexFilterAndGeneratorView.setFocus();
    },

    closePannel(){
        this.toggleToPannel.hide();
        this.regexFilterAndGeneratorView.setText('');
    }

};
