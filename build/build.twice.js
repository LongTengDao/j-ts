'use strict';

const { SyntaxKind } = require('typescript');
const INDEX = /^\d+$/;
const known = new Set(require('fs').readFileSync(__dirname+'/knownSyntaxKind.tsv', 'utf8').match(/(?<=^[^\t\n]*\t)\w+/gm).slice(1));
const unknown = Reflect.ownKeys(SyntaxKind).filter(kind => {
	if ( INDEX.test(kind) ) { return false; }
	if ( known.has(kind) ) {
		known.delete(kind);
		return false;
	}
	return true;
});
if ( known.size ) { throw Error(`TypeScript.SyntaxKind (known) not found:\n${[ ...known ].join('\n')}`); }
if ( unknown.length ) { throw Error(`TypeScript.SyntaxKind (unknown) found:${unknown.map(kind => `\n${( ''+SyntaxKind[kind] ).padStart(3, ' ')}\t${kind}\t`).join('')}`); }

require('../test/test.js')(async ({ build, 龙腾道, get, map }) => {
	await build({
		name: 'j-ts',
		user: 'LongTengDao@ltd',
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		NPM: {
			description:
				'Pure transpiler for TypeScript. Belong to "Plan J".／'+
				'TypeScript 纯转译工具。从属于“简计划”。',
			keywords: [ 'TypeScript', 'TS', 'TSX' ],
			dependencies: {
				'typescript': '4.4.4',
			},
		},
		ES: 6,
		semver: await get('src/version'),
		LICENSE_: true,
		locate: {
			'@ltd/j-es': '../j-es/dist/ESM/.j-es.js',
		},
	});
	await map('docs/README.md'/*, gh => gh.replace(/(?<=[\n\r][ \t]*```+)[ \t]*\.?\w+[ \t]*(?=[\n\r])/g, '')*/, 'dist/NPM/README.md');
});
