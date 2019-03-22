type exports = {
	version :string
	install (
		readFile :(path :string, encoding :'utf8') => string | Promise<string>,
		useStrict? :false,
	) :void
	(ts :string, es? :3 | 5) :string
	transpileModule :exports
	default :exports
};
export = exports;