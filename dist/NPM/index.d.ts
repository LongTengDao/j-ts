export = exports;
type exports = Readonly<typeof transpileModule & {
	
	default :exports,
	
	transpileModule :typeof transpileModule,
	
	version :'3.0.1',
	
}>;
declare function transpileModule (ts :string, esv? :3 | 5) :{ outputText :string };