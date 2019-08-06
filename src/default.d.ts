export = exports;
declare const exports :transpileModule & Readonly<{
	default :typeof exports,
	transpileModule :transpileModule,
	version :string,
}>;
interface transpileModule {
	(input :string, esv? :3 | 5) :string
	(input :string, esv :object & { compilerOptions? :object & { target? :any, jsx? :void } }) :object & { outputText :string }
}