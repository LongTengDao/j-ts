export = exports;
type exports = Readonly<typeof transpileModule & {
	
	default :exports,
	
	transpileModule :typeof transpileModule,
	
	version :string,
	
}>;
declare function transpileModule (ts :string, esv? :3 | 5) :{ outputText :string };