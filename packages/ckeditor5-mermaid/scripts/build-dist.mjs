#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import { createRequire } from 'module';
import upath from 'upath';
import chalk from 'chalk';
import { build } from '@ckeditor/ckeditor5-dev-build-tools';

function dist( path ) {
	return upath.join( 'dist', path );
}

( async () => {
	const tsconfig = 'tsconfig.dist.ckeditor5.json';

	/**
	 * Step 1
	 */
	console.log( chalk.cyan( '1/2: Generating NPM build...' ) );

	const require = createRequire( import.meta.url );
	const pkg = require( upath.resolve( process.cwd(), './package.json' ) );

	await build( {
		input: 'src/index.ts',
		output: dist( './index.js' ),
		tsconfig: 'tsconfig.dist.json',
		external: [
			'ckeditor5',
			'ckeditor5-premium-features',
			...Object.keys( {
				...pkg.dependencies,
				...pkg.peerDependencies
			} )
		],
		clean: true,
		sourceMap: true,
		declarations: true,
		translations: '**/*.po'
	} );
} )();
