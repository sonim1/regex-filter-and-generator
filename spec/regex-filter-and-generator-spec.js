'use babel';

import RegexFilterAndGenerator from '../lib/regex-filter-and-generator';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('RegexFilterAndGenerator', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('regex-filter-and-generator');
  });

  describe('when the regex-filter-and-generator:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.regex-filter-and-generator')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'regex-filter-and-generator:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.regex-filter-and-generator')).toExist();

        let regexFilterAndGeneratorElement = workspaceElement.querySelector('.regex-filter-and-generator');
        expect(regexFilterAndGeneratorElement).toExist();

        let regexFilterAndGeneratorPanel = atom.workspace.panelForItem(regexFilterAndGeneratorElement);
        expect(regexFilterAndGeneratorPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'regex-filter-and-generator:toggle');
        expect(regexFilterAndGeneratorPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.regex-filter-and-generator')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'regex-filter-and-generator:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let regexFilterAndGeneratorElement = workspaceElement.querySelector('.regex-filter-and-generator');
        expect(regexFilterAndGeneratorElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'regex-filter-and-generator:toggle');
        expect(regexFilterAndGeneratorElement).not.toBeVisible();
      });
    });
  });
});
