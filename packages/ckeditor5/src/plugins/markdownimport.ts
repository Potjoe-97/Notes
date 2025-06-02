import { ButtonView, Plugin } from 'ckeditor5';
import markdownIcon from '../icons/markdown-mark.svg?raw';

export default class MarkdownImportPlugin extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'markdownImport', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Markdown import from clipboard',
				icon: markdownIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				glob.importMarkdownInline();
			} );

			return view;
		} );
	}
}
