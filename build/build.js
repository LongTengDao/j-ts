'use strict';

const typescript = '3.5.2';

if ( require('typescript/package.json').version!==typescript ) { throw Error('typescript version'); }

const known = new Set(require('fs').readFileSync(__dirname+'/knownSyntaxKind.tsv', 'utf8').match(/(?<=\t)\w+/g));

const index = /^\d+$/;

const { SyntaxKind } = require('typescript');

const unknown = Reflect.ownKeys(SyntaxKind).filter(kind => {
	if ( index.test(kind) ) { return false; }
	if ( known.has(kind) ) {
		known.delete(kind);
		return false;
	}
	return true;
});

if ( known.size ) { throw Error(`TypeScript.SyncKind known:\n${[ ...known ].join('\n')}`); }

if ( unknown.length ) { throw Error(`TypeScript.SyntaxKind unknown:${unknown.map(kind => `\n${( ''+SyntaxKind[kind] ).padStart(3, ' ')}\t${kind}`).join('')}`); }

require('../test/test.js')(async ({ build, 龙腾道, get }) => {
	await build({
		name: 'j-ts',
		user: 'LongTengDao@ltd',
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		NPM: {
			description:
				'TypeScript-ECMAScript transpiler with pretty source mapping while not using sourceMap. Belong to "Plan J".／'+
				'不借助 sourceMap 实现源码位置映射的 TypeScript-ECMAScript 转译工具。从属于“简计划”。',
			dependencies: {
				typescript,
			},
		},
		ES: 6,
		semver: await get('src/version'),
		LICENSE_: true,
	});
});
