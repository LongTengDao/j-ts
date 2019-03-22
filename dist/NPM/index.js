'use strict';

const { transpileModule, ModuleKind: { ESNext } } = require('typescript');
const Parser = require('acorn').Parser.extend(require('acorn-bigint'));
const { dirname } = require('path');
const { stringify } = JSON;
const { min } = Math;

const AsyncFunction = async function () {}.constructor;
const BOM = '\uFEFF';
let ESV = 0;
const WHITE = /^\s/;
const BLOCK = { type: true };
const INLINE = { type: false };

exports.install = install;
exports.version = '1.0.0';
module.exports = exports.default = exports.transpileModule = exports;

function install (readFile, useStrict = true) {
	if ( typeof readFile!=='function' ) { throw TypeError('@ltd/j-ts.install(readFile)'); }
	require.extensions['.ts'] = function require_ts (module, filename) {
		let code = readFile(filename, 'utf8');
		if ( code instanceof Promise ) {
			const originalExports = module.exports;
			module.exports = async function (promise) {
				let code = await promise;
				code = exports(code);
				if ( useStrict ) { code = code.startsWith(BOM) ? BOM+`'use strict';`+code.slice(1) : `'use strict';`+code; }
				await AsyncFunction('exports,require,module,__filename,__dirname', code)
				.call(module.exports = originalExports, originalExports, module.require, module, filename, dirname(filename));
				return module.exports;
			}(code);
		}
		else {
			code = exports(code);
			if ( useStrict ) { code = code.startsWith(BOM) ? BOM+`'use strict';`+code.slice(1) : `'use strict';`+code; }
			Function('exports,require,module,__filename,__dirname', code)
			.call(module.exports, module.exports, module.require, module, filename, dirname(filename));
		}
	};
}

function exports (ts, esv) {
	if ( typeof ts!=='string' ) { throw TypeError('@ltd/j-ts(ts)'); }
	let bom = false;
	if ( ts.startsWith(BOM) ) {
		ts = ts.slice(1);
		if ( ts.startsWith(BOM) ) { throw Error('@ltd/j-ts(ts): BOM+BOM'); }
		bom = true;
	}
	if ( !esv ) { ESV = 0; }
	else if ( esv===3 || esv===5 ) { ESV = esv; }
	else { throw RangeError('@ltd/j-ts(,esv)'); }
	const { outputText, diagnostics } = transpileModule(ts, {
		compilerOptions: {
			extendedDiagnostics: true,
			target: ESV ? 'ES'+ESV : 'ESNext',
			module: ESNext,
			newLine: 'lf',
			emitBOM: false,
		},
	});
	if ( diagnostics.length ) { throw Error('@ltd/j-ts typescript.transpileModule().diagnostics[0]: '+diagnostics[0]); }
	return ( bom ? BOM : '' )+padAs(outputText, ts);
}

function padAs (es, ts) {
	let esAsTs = '';
	let ts_index = 0;
	const ts_length = ts.length;
	const tokens = tokensOf(es);
	for ( const { start, end } of tokens ) {
		const part = es.slice(start, end);
		while ( !ts.startsWith(part, ts_index) ) {
			if ( ts_index===ts_length ) { throw Error('@ltd/j-ts interal error: TypeScript had inserted codes '+stringify(part)); }
			const char = ts[ts_index];
			esAsTs += WHITE.test(char) ? char : ' ';
			++ts_index;
		}
		esAsTs += part;
		ts_index += part.length;
	}
	compareWith(esAsTs, tokens);
	return esAsTs;
}

function tokensOf (es) {
	const tokens = [];
	Parser.parse(es, {
		ecmaVersion: ESV || 2014,
		sourceType: 'module',
		onInsertedSemicolon (index) {
			throw Error('@ltd/j-ts acorn.parse(es) onInsertedSemicolon('+index+'): '+stringify([es.slice(0, index), es.slice(index)], null, 4));
		},
		allowReserved: ESV===3 ? 'never' : false,
		allowReturnOutsideFunction: true,
		allowAwaitOutsideFunction: true,
		allowHashBang: true,
		onToken: tokens,
		onComment (block, text, start, end) { tokens.push({ type: block, start, end }); },
	});
	return tokens;
}

function compareWith (esAsTs, expect) {
	const tokens = [];
	Parser.parse(esAsTs, {
		ecmaVersion: ESV || 2014,
		sourceType: 'module',
		onInsertedSemicolon (index) {
			throw Error('@ltd/j-ts acorn.parse(esAsTs) onInsertedSemicolon('+index+'): '+stringify([esAsTs.slice(0, index), esAsTs.slice(index)], null, 4));
		},
		allowReserved: ESV===3 ? 'never' : false,
		allowReturnOutsideFunction: true,
		allowAwaitOutsideFunction: true,
		allowHashBang: true,
		onToken: tokens,
		onComment (block) { tokens.push(block ? BLOCK : INLINE); },
	});
	const length = min(tokens.length, expect.length);
	for ( let index = 0; index<length; ++index ) {
		if ( tokens[index].type!==expect[index].type ) { throw Error('@ltd/j-ts'); }
	}
	if ( expect.length!==tokens.length ) { throw Error('@ltd/j-ts tokens.length from '+expect.length+' to '+tokens.length); }
}
