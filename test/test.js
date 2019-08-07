'use strict';

const ts = require('typescript');

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async function ({ import_default, get }) {
	const transpileModule = await import_default('src/default', {
		require: function (id) {
			if ( id!=='typescript' ) { throw id; }
			return require(id);
		},
		ES: 6,
	});
	const input = await get('test/sample.ts');
	const outputText = transpileModule(input);
	if ( outputText!==await get('test/expect.js') ) {
		console.info(JSON.stringify(
			function N (node) {
				const children = [];
				let index = node.pos;
				ts.forEachChild(node, function (child) {
					if ( index!==child.pos ) { children.push(input.slice(index, child.pos)); }
					children.push(N(child));
					index = child.end;
				});
				if ( index!==node.end ) { children.push(input.slice(index, node.end)); }
				return { kind: ts.SyntaxKind[node.kind], children };
			}(ts.createSourceFile('', input, ts.ScriptTarget.Latest)),
			null,
			'\t',
		));
		console.info(outputText);
		throw Error('test');
	}
});
