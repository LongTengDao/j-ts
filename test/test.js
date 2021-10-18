'use strict';

const EOL = /\r\n?|[\n\u2028\u2029]/;
const jsx = $ => `createElement(${/^[a-z][^.]*$|[-:]/.test($) ? `'${$}'` : $ || 'Fragment'},`;

module.exports = require('j-dev')(__dirname + '/..')(async function ({ import_default, get, put }) {
	const transpileModule = await import_default('src/default', {
		ES: 6,
		require: [ 'typescript', '@ltd/j-es' ],
	});
	await [
		[ 'ts' , 'js' , undefined ],
		[ 'tsx', 'jsx', true ],
		[ 'tsx', 'js' , jsx ],
	]
	.reduce(async function cb (ret, one, n) {
		if ( !one ) { return; }
		await ret;
		++n;
		const [ sampleExt, expectExt, jsx ] = one;
		const sample = await get(`test/${n}.sample.${sampleExt}`);
		const output = transpileModule(sample, jsx);
		const expect = await get(`test/${n}.expect.${expectExt}`);
		if ( output===expect ) { return; }
		await put(`test/output#.jsx`, output);
		const outputLines = output.split(EOL);
		const expectLines = expect.split(EOL);
		const length = Math.min(output.length, expect.length);
		for ( let lineIndex = 0; lineIndex<length; ++lineIndex ) {
			const outputLine = outputLines[lineIndex];
			const expectLine = expectLines[lineIndex];
			if ( outputLine!==expectLine ) {
				let columnIndex = 0;
				for ( const length = Math.min(outputLine.length, expectLine.length); columnIndex<length; ++columnIndex ) {
					if ( outputLine[columnIndex]!==expectLine[columnIndex] ) { break; }
				}
				throwError('inline', lineIndex + 1, columnIndex + 1);
			}
		}
		output.length===expect.length || throwError('eof', length, outputLines[length - 1].length + 1);
		throw Error(`${n} eol`);
		function throwError (message, lineNumber, columnNumber) {
			const { sep } = require('path');
			const error = Error(`${n} ${message}`);
			error.stack = [
				`Error: ${n} ${message}`,
				`    at ${__dirname}${sep}output#.jsx:${lineNumber}:${columnNumber}`,
				`    at ${__dirname}${sep}${n}.expect.${expectExt}:${lineNumber}:${columnNumber}`,
				`    at ${__dirname}${sep}${n}.sample.${sampleExt}:${lineNumber}:${columnNumber}`,
			].join('\n');
			throw error;
		}
	}, Promise.resolve());
});
