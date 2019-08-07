export = exports;

declare const exports :transpileModule & Readonly<{
	
	version :string,
	
	transpileModule :transpileModule,
	
	default :typeof exports,
	
}>;

interface transpileModule {
	
	(input :string, jsx? :boolean) :string
	
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
