export = exports;
declare const exports :transpileModule & Readonly<{
	default :typeof exports,
	transpileModule :transpileModule,
	version :'4.1.1',
}>;
interface transpileModule {
	(input :string, esv? :3 | 5) :string
	(input :string, esv :object & { compilerOptions? :object & { target? :any } }) :object & { outputText :string }
}