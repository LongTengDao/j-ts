'use strict';

require('@ltd/j-dev')(__dirname)(async ({ map }) => {
	
	const transpileModule = require('../dist/NPM');
	
	await map(
		'sample.ts',
		transpileModule,
		'expect.js',
	);
	
});
