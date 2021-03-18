export = exports;

declare const exports :typeof transpileModule & object & Readonly<{
	
	version :'6.2.4',
	
	transpileModule :typeof transpileModule,
	
	default :typeof exports,
	
}>;

declare function transpileModule (input :string, jsx? :false | true) :string;

declare function transpileModule (input :string, transpileOptions :object & {
	readonly compilerOptions :object & {
		readonly jsx? :number | 'None' | 'Preserve' | 'ReactNative',
		readonly sourceMap? :false,
		readonly useDefineForClassFields :true,
	},
}) :object & {
	outputText :string,
	diagnostics :undefined | any[],
	sourceMapText :undefined,
};
