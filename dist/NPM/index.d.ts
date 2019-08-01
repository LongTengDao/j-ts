export = exports;
declare const exports :Readonly<typeof transpileModule & {
	
	default :typeof exports,
	
	transpileModule :typeof transpileModule,
	
	version :'4.0.0',
	
}>;

declare function transpileModule (input :string, esv? :3 | 5) :string;

declare function transpileModule (input :string, esv :object & { compilerOptions? :object & { target? :import('typescript').ScriptTarget } }) :object & { outputText :string };
