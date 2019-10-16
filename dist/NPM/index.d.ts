export = exports;

declare const exports :transpileModule & Readonly<{
	
	version :'6.0.4',
	
	transpileModule :transpileModule,
	
	default :typeof exports,
	
}>;

interface transpileModule {
	
	(input :string, jsx? :false | true) :string
	
	(input :string, transpileOptions :Readonly<object & {
		compilerOptions? :Readonly<object & {
			jsx? :number | string,
		}>
	}>) :object & {
		outputText :string,
		diagnostics :undefined | any[],
		sourceMapText :undefined,
	}
	
}
