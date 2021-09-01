'use strict';

const EOL = /\r\n?|[\n\u2028\u2029]/;

module.exports = require('j-dev')(__dirname+'/..')(async function ({ import_default, get, put, ful }) {
	const transpileModule = await import_default('src/default', {
		require: [ 'typescript' ],
		ES: 6,
	});
	const sample = await get('test/sample.ts');
	let output;
	try { output = transpileModule(sample); }
	catch (posError) {
		if ( typeof posError.pos==='number' ) {
			const before = sample.slice(0, posError.pos).split(/\r\n?|[\n\u2028\u2029]/);
			posError.message += `\n    at (${ful('test/sample.ts')}:${before.length}:${before[before.length - 1].length + 1})`;
		}
		throw posError;
	}
	const expect = await get('test/expect.js');
	if ( output!==expect ) {
		await put('test/output#.js', output);
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
				throwError('inline', lineIndex+1, columnIndex+1);
			}
		}
		if ( output.length!==expect.length ) {
			throwError('eof', length, outputLines[length-1].length+1);
		}
		throw Error('eol');
	}
});

function throwError (message, lineNumber, columnNumber) {
	const { sep } = require('path');
	const error = Error(message);
	error.stack = [
		`Error: ${message}`,
		`    at ${__dirname}${sep}sample.ts:${lineNumber}:${columnNumber}`,
		`    at ${__dirname}${sep}output#.js:${lineNumber}:${columnNumber}`,
		`    at ${__dirname}${sep}expect.js:${lineNumber}:${columnNumber}`,
	].join('\n');
	throw error;
}
