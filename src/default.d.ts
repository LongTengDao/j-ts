export = exports;
declare const exports :Readonly<typeof transpileModule & {
	
	default :typeof exports,
	
	transpileModule :typeof transpileModule,
	
	version :string,
	
}>;
declare function transpileModule (ts :string, esv? :3 | 5) :{ outputText :string };