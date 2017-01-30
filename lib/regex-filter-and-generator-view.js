'use babel';

import {TextEditor, Range, Point, CompositeDisposable} from 'atom'
import usefulRegexs from '../data/usefulRegex.json';

export default class RegexFilterAndGeneratorView {

    constructor(serializedState, callback) {
        //init
        this.callback = callback;
        this.decorationsByEditorId = {};

        /***Start
            Create Pannel Element
        ***/
        this.element = document.createElement('div');
        this.element.classList.add('regex-filter-and-generator');

        // Create Title
        const title_RegexFilter = document.createElement('span');
        title_RegexFilter.textContent = 'Regex Filter';
        title_RegexFilter.classList.add('title_RegexFilter');
        this.element.appendChild(title_RegexFilter);

        // Create Input Text Field
        this.miniEditor = new TextEditor({mini: true, placeholderText: '/([A-Z])\w+/g'});
        this.element.appendChild(this.miniEditor.element);

        // Create Title
        const title_RegexGenerator = document.createElement('span');
        title_RegexGenerator.textContent = 'Regex Generator';
        title_RegexGenerator.classList.add('title_RegexGenerator');
        this.element.appendChild(title_RegexGenerator);

        //
        this.generator_element = document.createElement('div');
        this.generator_element.classList.add('regex-generator');

        //usefulRegex Setting
        this.usefulRegex = usefulRegexs['usefulRegex'];
        this.generatorButtons = [];
        if (this.usefulRegex.length > 0) {
            for (var idx in this.usefulRegex) {
                const inputButton_ = document.createElement('input');
                inputButton_.setAttribute('type', 'button');
                inputButton_.setAttribute('value', this.usefulRegex[idx]['name'].toString());
                inputButton_.classList.add('generator-btn');
                this.generator_element.appendChild(inputButton_);
                this.generatorButtons.push(inputButton_);
            }
        }
        this.element.appendChild(this.generator_element);
        /***End
            Create Element
        ***/

        this.handleFindEvents();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        if (this.subscriptions)
            this.subscriptions.dispose();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    closePannel(e) {
        if (e.keyCode == 27) {
            this.callback.closePannel();
        }
    }

    setText(inputText) {
        if (inputText === undefined || inputText === null) {
            inputText = '';
        }
        this.miniEditor.setText(inputText);
    }

    setFocus() {
        this.miniEditor.element.focus();
    }

    regexFilter() {
        let findPattern = this.miniEditor.getText();
        let slashLength = findPattern.match(new RegExp('/', 'ig'));

        let editor = this.getEditor();
        if(editor == null){
            return false;
        }

        //init and destroy Docrations
        this.destroyDecorations(editor);

        //check regular expression
        if (slashLength != null && slashLength.length == 2) {
            let expression = '';
            let flags = 'g';

            expression = findPattern.substring(findPattern.indexOf('/') + 1, findPattern.indexOf('/', findPattern.indexOf('/') + 1));

            flags = findPattern.substring(findPattern.indexOf('/', findPattern.indexOf('/') + 1) + 1, findPattern.length);

            let markers = [];
            try {
                var search = new RegExp(expression, flags);
                editor.scanInBufferRange(search, Range(Point.ZERO, Point.INFINITY), ({range}) => {
                    markers.push(range);
                });
            } catch (error) {
                if (/RegExp too big$/.test(error.message)) {
                    error.message = "Search string is too large";
                }
                return false;
            }

            //Setting
            for (var idx in markers) {
                let decoration = this.createDecorationFromCurrentSelection(editor, markers[idx]);
                this.decorationsByEditorId[editor.id].push(decoration);
            }
        }
    }

    handleFindEvents() {
        this.miniEditor.element.addEventListener('keydown', this.closePannel.bind(this));
        this.miniEditor.element.getModel().onDidStopChanging(this.regexFilter.bind(this));

        //Regex Generator Button Append Event
        for (let idx in this.generatorButtons) {
            this.generatorButtons[idx].addEventListener('click', () => {
                let expression = this.usefulRegex[idx]['expression'];
                let flags = this.usefulRegex[idx]['flags'];
                this.setText('/' + expression + '/' + flags);
            });
        }
    }

    createDecorationFromCurrentSelection(editor, range) {
        let marker = editor.markBufferRange(range, {invalidate: 'inside'});
        let decoration = editor.decorateMarker(marker, {
            type: 'highlight',
            class: "regexmarker-found"
        });
        return decoration;
    }

    destroyDecorations(editor) {
        for (var idx in this.decorationsByEditorId[editor.id]) {
            this.decorationsByEditorId[editor.id][idx].destroy();
        }
        this.decorationsByEditorId[editor.id] = [];

    }

    getEditor() {
        let editor = atom.workspace.getActiveTextEditor();
        if (editor === undefined){
            return null;
        }
        else if(!editor.hasOwnProperty('id')){
            return null;
        }

        return editor;
    }

}
