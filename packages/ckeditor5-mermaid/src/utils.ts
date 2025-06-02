/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Editor } from "ckeditor5";

/**
 * Helper function for setting the `isOn` state of buttons.
 *
 * @private
 * @param commandName Short name of the command.
 */
export function checkIsOn( editor: Editor, commandName: string ) {
	const selection = editor.model.document.selection;
	const mermaidItem = selection.getSelectedElement() || selection.getLastPosition()?.parent;

	if ( mermaidItem && mermaidItem.is( 'element', 'mermaid' ) && mermaidItem.getAttribute( 'displayMode' ) === commandName ) {
		return true;
	}

	return false;
}
