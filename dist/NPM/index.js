'use strict';

const { transpileModule, ModuleKind: { ESNext } } = require('typescript');
const Acorn_parser = require('acorn').Parser.extend(require('acorn-bigint'));
const { dirname } = require('path');

const AsyncFunction = async function () {}.constructor;
const BOM = '\uFEFF';
let ESV = 0;
const WHITE = /^\s/;

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
			//downlevelIteration: ESV<6,// default false for index<length; true for .next() .done()
			//importHelpers: true,// default false; true for tslib
			//experimentalDecorators: true,
			//emitDecoratorMetadata: false,
			newLine: 'lf',
			emitBOM: false,
		},
	});
	if ( diagnostics.length ) { throw Error('@ltd/j-ts typescript.transpileModule().diagnostics[0]: '+diagnostics[0]); }
	return ( bom ? BOM : '' )+padAs(outputText, ts);
}

function padAs (es, ts) {
	let as = '';
	let index = 0;
	const length = ts.length;
	for ( const token of tokensOf(es) ) {
		const part = es.slice(token.start, token.end);
		while ( !ts.startsWith(part, index) ) {// top|type x = 'return throw(top:syntax-err//options) break(top:syntax-err) continue(top:syntax-err) async(runtime-err) yield(top:syntax-err) // await-options?';\n return xxx;
			if ( index===length ) { throw Error('@ltd/j-ts interal error: TypeScript had inserted codes'); }
			const char = ts[index];
			as += WHITE.test(char) ? char : ' ';
			++index;
		}
		as += part;
		index += part.length;
	}
	return as;
}

function tokensOf (es) {
	const tokens = [];
	tokens.push(...Acorn_parser.tokenizer(es, {
		ecmaVersion: ESV || 2014,
		sourceType: 'module',
		onInsertedSemicolon (index) { throw Error('@ltd/j-ts acorn.tokenizer: onInsertedSemicolon('+index+')'); },
		//onTrailingComma,
		allowReserved: ESV===3 ? 'never' : true,
		//allowReturnOutsideFunction
		//allowImportExportEverywhere
		//allowAwaitOutsideFunction
		//allowHashBang
		//locations
		//onToken: tokens,
		onComment (block, text, start, end) { tokens.push({ start, end }); },
		//ranges
		//program
		//sourceFile
		//directSourceFile
		//preserveParens
	}));
	return tokens.sort(compare);
}

function compare (a, b) { return a.start-b.start; }
