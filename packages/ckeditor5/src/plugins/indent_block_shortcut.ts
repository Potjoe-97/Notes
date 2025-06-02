/**
 * https://github.com/zadam/trilium/issues/978
 */

import { DocumentFragment, Element, Plugin, Position } from "ckeditor5";

export default class IndentBlockShortcutPlugin extends Plugin {

    init() {
        this.editor.keystrokes.set( 'Tab', ( _, cancel ) => {
            const command = this.editor.commands.get( 'indentBlock' );

            if (command && command.isEnabled && !this.isInTable() ) {
                command.execute();
                cancel();
            }
        } );

        this.editor.keystrokes.set( 'Shift+Tab', ( _, cancel ) => {
            const command = this.editor.commands.get( 'outdentBlock' );

            if (command && command.isEnabled && !this.isInTable() ) {
                command.execute();
                cancel();
            }
        } );
    }

    // in table TAB should switch cells
    isInTable() {
        let el: Position | Element | DocumentFragment | null = this.editor.model.document.selection.getFirstPosition();

        while (el) {
            if ("name" in el && el.name === 'tableCell') {
                return true;
            }

            el = "parent" in el ? el.parent : null;
        }

        return false;
    }

}
