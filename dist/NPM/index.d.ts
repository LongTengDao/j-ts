export = exports;

declare const exports :typeof transpileModule & object & Readonly<{
	
	version :'6.3.1',
	
	transpileModule :typeof transpileModule,
	
	default :typeof exports,
	
}>;

declare function transpileModule (input :string, jsx? :false | true) :string;

declare function transpileModule (input :string, transpileOptions :object & {
	readonly compilerOptions? :object & {
		readonly jsx? :0 | 1 | 3 | 'None' | 'Preserve' | 'ReactNative' | 'preserve' | 'react-native',
		readonly sourceMap? :false,
		readonly useDefineForClassFields? :true,
	},
}) :object & {
	outputText :string,
	diagnostics :undefined | any[],
	sourceMapText :undefined,
};
