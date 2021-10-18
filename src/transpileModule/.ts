import TypeError from '.TypeError';
import undefined from '.undefined';

import * as deps from '../deps';
import * as ing from './ing';
import * as util from './util';
import * as TSX from './TSX/';
import erase from './erase/';

const OutputText = (fileName :string, X :boolean) :string => [ ...erase(deps.createSourceFile(fileName, ing.ts, deps.ESNext, false, X ? deps.TSX : deps.TS)) ].join('');

export default (input :string, jsx_transpileOptions :boolean | import('./TSX/toJS').GenerateStart | {
	readonly compilerOptions? :{
		readonly sourceMap? :boolean,
		readonly jsx? :import('typescript').JsxEmit,
		readonly jsxImportSource? :string,
		readonly jsxFactory? :string,
		readonly jsxFragmentFactory? :string,
		readonly reactNamespace? :string,
		readonly useDefineForClassFields? :boolean,
		readonly downlevelIteration? :boolean,
		readonly experimentalDecorators? :boolean,
	}
} = false, fileName? :string) :string | ReturnType<typeof import('../default.d').transpileModule> => {
	ing.on();
	try {
		ing.set_ts(input);
		if ( typeof jsx_transpileOptions==='object' ) {
			const compilerOptions = jsx_transpileOptions?.compilerOptions;
			const sourceMap = compilerOptions?.sourceMap;
			if ( sourceMap!==undefined && sourceMap!==false ) { throw TypeError(`transpileModule(,{compilerOptions:{sourceMap:!false}})`); }
			let X :boolean;
			const jsX = compilerOptions?.jsx as string | number | undefined;
			switch ( typeof jsX==='string' ? util.A2a(jsX) : jsX ) {
				case undefined:
				case deps.None:
					X = false;
					break;
				case deps.Preserve:
				case deps.ReactNative:
				case 'preserve':
				case 'react-native':
					TSX.onJSX();
					X = true;
					break;
				case deps.React:
				case 'react':
					if ( compilerOptions?.jsxImportSource!==undefined ) { throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react',jsxImportSource:!undefined}})`); }
					TSX.onJS$(compilerOptions);
					X = true;
					break;
				case deps.ReactJSX:
				case 'react-jsx':
					throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react-jsx'}})`);
				case deps.ReactJSXDev:
				case 'react-jsxdev':
					throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react-jsxdev'}})`);
				default:
					throw TypeError('transpileModule(,{compilerOptions:{jsx:unknown}})');
			}
			const useDefineForClassFields = compilerOptions?.useDefineForClassFields;
			if ( useDefineForClassFields!==undefined && useDefineForClassFields!==true ) { throw TypeError(`transpileModule(,{compilerOptions:{useDefineForClassFields:!true}})`); }
			const downlevelIteration = compilerOptions?.downlevelIteration;
			if ( downlevelIteration!==undefined && downlevelIteration!==false ) { throw TypeError(`transpileModule(,{compilerOptions:{downlevelIteration:!false}})`); }
			const experimentalDecorators = compilerOptions?.experimentalDecorators;
			if ( experimentalDecorators!==undefined && experimentalDecorators!==false ) { throw TypeError(`transpileModule(,{compilerOptions:{experimentalDecorators:!false}})`); }
			ing.set_filename(fileName);
			const { diagnostics } = deps.TypeScript_transpileModule(ing.ts, jsx_transpileOptions);
			return {
				diagnostics,
				outputText: OutputText(typeof fileName==='string' ? fileName : '', X),
				sourceMapText: undefined,
			};
		}
		else {
			if ( typeof jsx_transpileOptions==='function' ) {
				TSX.onJS(jsx_transpileOptions);
				jsx_transpileOptions = true;
			}
			else { jsx_transpileOptions && TSX.onJSX(); }
			ing.set_filename(fileName);
			return OutputText('', jsx_transpileOptions);
		}
	}
	finally {
		TSX.off();
		ing.off();
	}
};
