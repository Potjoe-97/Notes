import { AttributeCommand, Plugin } from "ckeditor5";

const KBD = 'kbd';

/**
 * The keyboard shortcut (`kbd`) editing feature.
 *
 * It registers the `'kbd'` command, associated keystroke and introduces the
 * `kbd` attribute in the model which renders to the view as a `<kbd>` element.
 */
export default class KbdEditing extends Plugin {

	public static get pluginName() {
		return 'KbdEditing' as const;
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow kbd attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: KBD } );
		editor.model.schema.setAttributeProperties( KBD, {
			isFormatting: true,
			copyOnEnter: true
		} );

		editor.conversion.attributeToElement( {
			model: KBD,
			view: KBD
		} );

		editor.commands.add( KBD, new AttributeCommand( editor, KBD ) );
		editor.keystrokes.set( 'CTRL+ALT+K', KBD );
	}
}
