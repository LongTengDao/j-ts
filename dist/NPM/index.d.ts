export = exports;

declare const exports :typeof transpileModule & object & Readonly<{
	
	version :'7.0.0',
	
	transpileModule :typeof transpileModule,
	
	default :typeof exports,
	
}>;

declare function transpileModule (input :string, jsx? :false | true | ( (this :void, value :string, index :number) => `${string}(${string},` | `${string}(` ), fileName? :string) :string;

declare function transpileModule (input :string, transpileOptions :object & {
	readonly compilerOptions? :object & {
		readonly sourceMap? :false,
		readonly jsx? :0 | 1 | 3 | 'preserve' | 'react-native',// 'react-jsx' 'react-jsxdev'
		readonly jsxImportSource? :undefined,// 'react' | string += '/jsx-runtime' '/jsx-dev-runtime'
		readonly jsxFactory? :'/*#__PURE__*/React.createElement' | string,
		readonly jsxFragmentFactory? :'React.Fragment' | string,
		readonly reactNamespace? :'React' | string,
		readonly useDefineForClassFields? :true,
		readonly downlevelIteration? :false,
		readonly experimentalDecorators? :false,
	},
}, fileName? :string) :object & {
	outputText :string,
	sourceMapText :undefined,
	diagnostics :undefined | {
		start? :undefined | number,
		length? :undefined | number,
		category :DiagnosticCategory,
		code :number,
		messageText :string | DiagnosticMessageChain
	}[],
};
interface DiagnosticMessageChain {
	category :DiagnosticCategory
	code :number
	messageText :string
	next? :undefined | DiagnosticMessageChain[]
}
declare enum DiagnosticCategory { Warning = 0, Error = 1, Suggestion = 2, Message = 3 }
