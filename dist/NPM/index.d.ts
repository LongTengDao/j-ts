export = exports;
declare const exports :Readonly<typeof transpileModule & {
	
	default :typeof exports,
	
	transpileModule :typeof transpileModule,
	
	version :'3.0.4',
	
}>;
declare function transpileModule (ts :string, esv? :3 | 5) :{ outputText :string };