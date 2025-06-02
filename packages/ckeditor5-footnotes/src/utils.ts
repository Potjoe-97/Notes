import { type Editor, Element, Text, TextProxy, ViewElement } from 'ckeditor5';

// There's ample DRY violation in this file; type checking
// polymorphism without full typescript is just incredibly finicky.
// I (Jonathan) suspect there's a more elegant solution for this,
// but I tried a lot of things and none of them worked.

/**
 * Returns an array of all descendant elements of
 * the root for which the provided predicate returns true.
 */
export const modelQueryElementsAll = (
	editor: Editor,
	rootElement: Element,
	predicate: ( item: Element ) => boolean = _ => true
): Array<Element> => {
	const range = editor.model.createRangeIn( rootElement );
	const output: Array<Element> = [];

	for ( const item of range.getItems() ) {
		if ( !( item instanceof Element ) ) {
			continue;
		}

		if ( predicate( item ) ) {
			output.push( item );
		}
	}
	return output;
};

/**
 * Returns an array of all descendant text nodes and text proxies of
 * the root for which the provided predicate returns true.
 */
export const modelQueryTextAll = (
	editor: Editor,
	rootElement: Element,
	predicate: ( item: Text | TextProxy ) => boolean = _ => true
): Array<Text | TextProxy> => {
	const range = editor.model.createRangeIn( rootElement );
	const output: Array<Text | TextProxy> = [];

	for ( const item of range.getItems() ) {
		if ( !( item instanceof Text || item instanceof TextProxy ) ) {
			continue;
		}

		if ( predicate( item ) ) {
			output.push( item );
		}
	}
	return output;
};

/**
 * Returns the first descendant element of the root for which the provided
 * predicate returns true, or null if no such element is found.
 */
export const modelQueryElement = (
	editor: Editor,
	rootElement: Element,
	predicate: ( item: Element ) => boolean = _ => true
): Element | null => {
	const range = editor.model.createRangeIn( rootElement );

	for ( const item of range.getItems() ) {
		if ( !( item instanceof Element ) ) {
			continue;
		}

		if ( predicate( item ) ) {
			return item;
		}
	}
	return null;
};

/**
 * Returns the first descendant text node or text proxy of the root for which the provided
 * predicate returns true, or null if no such element is found.
 */
export const modelQueryText = (
	editor: Editor,
	rootElement: Element,
	predicate: ( item: Text | TextProxy ) => boolean = _ => true
): Text | TextProxy | null => {
	const range = editor.model.createRangeIn( rootElement );

	for ( const item of range.getItems() ) {
		if ( !( item instanceof Text || item instanceof TextProxy ) ) {
			continue;
		}

		if ( predicate( item ) ) {
			return item;
		}
	}
	return null;
};

/**
 * Returns the first descendant element of the root for which the provided
 * predicate returns true, or null if no such element is found.
 */
export const viewQueryElement = (
	editor: Editor,
	rootElement: ViewElement,
	predicate: ( item: ViewElement ) => boolean = _ => true
): ViewElement | null => {
	const range = editor.editing.view.createRangeIn( rootElement );

	for ( const item of range.getItems() ) {
		if ( !( item instanceof ViewElement ) ) {
			continue;
		}

		if ( predicate( item ) ) {
			return item;
		}
	}
	return null;
};

