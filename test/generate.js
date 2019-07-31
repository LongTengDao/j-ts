'use strict';

require('@ltd/j-dev')(__dirname)(async ({ map }) => {
	
	const transpileModule = require('../dist/NPM');
	
	await map(
		'sample.ts',
		ts => transpileModule(ts).outputText,
		'expect.js',
	);
	
});
