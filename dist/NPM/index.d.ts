export = exports;
type exports = Readonly<typeof transpileModule & {
	
	default :exports,
	
	transpileModule :typeof transpileModule,
	
	version :'3.0.0',
	
}>;
declare function transpileModule (ts :string, esv? :3 | 5) :{ outputText :string };