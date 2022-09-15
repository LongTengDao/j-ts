
declare module '.Array' { export default Array; }
declare module '.Array.isArray?=' { export default isArray;
	function isArray (this :void, value :unknown) :value is readonly any[];
}
declare module '.Array.prototype' { export default Array.prototype; }
declare module '.Array.prototype.push' { export default Array.prototype.push; }

declare module '.Date.prototype.valueOf' { export default Date.prototype.valueOf; }

declare module '.Error' { export default Error_;
	interface Error_ extends Error { readonly cause? :Error }
	const Error_ :{
		   <                 C extends Error> (this :void, message  :string, _cause_ :{ readonly cause :C }) :Error & { readonly cause :C };
		                                      (this :void, message? :string                                ) :Error;
		new<                 C extends Error> (            message  :string, _cause_ :{ readonly cause :C }) :Error & { readonly cause :C };
		new                                   (            message? :string                                ) :Error;
		readonly captureStackTrace?/* ! if v8 */ :(targetObject :object, constructorOpt? :Function) => void;
		prepareStackTrace?/* ? even if v8 */ :(error :Error, stackTraces :readonly NodeJS.CallSite[]) => unknown;
		stackTraceLimit?/* ! if v8 */ :number;
	};
}
declare module '.Error?=' { export default Error_;
	interface Error_ extends Error { readonly cause? :Error }
	const Error_ :{
		   <                 C extends Error> (this :void, message  :string, _cause_ :{ readonly cause :C }) :Error & { readonly cause :C };
		                                      (this :void, message? :string                                ) :Error;
		new<                 C extends Error> (            message  :string, _cause_ :{ readonly cause :C }) :Error & { readonly cause :C };
		new                                   (            message? :string                                ) :Error;
		readonly captureStackTrace?/* ! if v8 */ :(targetObject :object, constructorOpt? :Function) => void;
		prepareStackTrace?/* ? even if v8 */ :(error :Error, stackTraces :readonly NodeJS.CallSite[]) => unknown;
		stackTraceLimit?/* ! if v8 */ :number;
	};
}

declare module '.Function.prototype.apply' { export default Function.prototype.apply; }
declare module '.Function.prototype.bind?' { export default Function.prototype.bind; }

declare module '.Infinity' { export default Infinity; }

declare module '.Map.prototype.keys?' { export default Map.prototype.keys; }

declare module '.Math.floor' { export default Math.floor; }

declare module '.Object' { export default O;
	type O = Object;
	const O :{ readonly [Method in keyof typeof Object] :typeof Object[Method] } & {
		<T> (value :T) :Objectify<T>;
		() :object;
		new<T> (value :T) :Objectify<T>;
		new () :object;
	};
	type Objectify<T> =
		T extends object ? T :
		T extends undefined | null ? object :
		T extends boolean ? object & Boolean :
		T extends number ? object & Number :
		T extends string ? object & String :
		T extends symbol ? object & Symbol :
		T extends bigint ? object & BigInt :
		never;
}
declare module '.Object.assign?' { export default Object.assign; }
declare module '.Object.create' { export default create;
	function create<P extends object | null, D extends TypedPropertyDescriptorMap<object> | void> (this :void, proto :P, descriptorMap? :D) :object & ( D extends TypedPropertyDescriptorMap<infer O> ? O : object ) & ( P extends object ? { [K in keyof P] :P[K] } : object );
	type TypedPropertyDescriptorMap<O> = { [K in keyof O] :TypedPropertyDescriptor<O[K]> };
}
declare module '.Object.create?=' { export default create;
	function create<P extends object | null> (this :void, proto :P) :P extends object ? object & { [K in keyof P] :P[K] } : object;
}
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.defineProperty?' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.freeze?' { export default Object.freeze; }
declare module '.Object.hasOwn?=' { export default hasOwn;
	function hasOwn<Key extends string | symbol> (this :void, nonNullable :{}, key :Key) :nonNullable is { readonly [K in Key] :unknown };
}
declare module '.Object.prototype' { export default Object.prototype; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.prototype.propertyIsEnumerable' { export default Object.prototype.propertyIsEnumerable; }
declare module '.Object.prototype.toString' { export default Object.prototype.toString; }

declare module '.Reflect.apply' { export default apply;
	function apply<This, Args extends readonly any[], Target extends (this :This, ...args :Args) => any> (this :void, target :Target, thisArg :This, args :{ readonly [Key in Extract<keyof Args, number | 'length'>] :Args[Key] }) :Target extends (this :This, ...args :Args) => infer R ? R : never;
}
declare module '.Reflect.construct?' { export default construct;
	function construct<Args extends readonly any[],    Target extends            new (...args :Args) => object                                   > (this :void, target :Target                       , args :Args                                      ) :Target extends new (...args :Args) => infer R ? R : never;
	function construct<Args extends readonly any[], NewTarget extends ( abstract new (...args :any ) => object ) & { readonly prototype :object }> (this :void, target :new (...args :Args) => object, args :Args, newTarget :new (...args :any) => any) :NewTarget['prototype']                                   ;
}

declare module '.RegExp' { export default RegExp; }
declare module '.RegExp.prototype.exec' { export default RegExp.prototype.exec; }
declare module '.RegExp.prototype.test' { export default RegExp.prototype.test; }

declare module '.Set.prototype.keys?' { export default Set.prototype.keys; }

declare module '.String' { export default String; }
declare module '.String.fromCharCode' { export default String.fromCharCode; }

declare module '.Symbol.species?' { export default Symbol.species; }
declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }
declare module '.Symbol?' { export default Symbol; }

declare module '.TypeError' { export default TypeError_;
	interface TypeError_ extends TypeError { readonly cause? :Error }
	const TypeError_ :{
		   <                 C extends Error> (this :void, message  :string, _cause_ :{ readonly cause :C }) :TypeError & { readonly cause :C };
		                                      (this :void, message? :string                                ) :TypeError;
		new<                 C extends Error> (            message  :string, _cause_ :{ readonly cause :C }) :TypeError & { readonly cause :C };
		new                                   (            message? :string                                ) :TypeError;
	};
}

declare module '.class.isDate' { export default isDate;
	function isDate (this :void, value :unknown) :value is Date;
}
declare module '.class.isMap' { export default isMap;
	function isMap (this :void, value :unknown) :value is ReadonlyMap<any, any>;
}
declare module '.class.isRegExp' { export default isRegExp;
	function isRegExp (this :void, value :unknown) :value is RegExp;
}
declare module '.class.isSet' { export default isSet;
	function isSet (this :void, value :unknown) :value is ReadonlySet<any>;
}

declare module '.default' { export default Default;
	function Default<Exports extends { readonly [name :string] :any, readonly default? :Module<Exports> }> (this :void, exports :Exports) :Module<Exports>;
	function Default<Statics extends { readonly [name :string] :any, readonly default? :ModuleFunction<Statics, Main> }, Main extends Callable | Newable | Callable & Newable> (this :void, main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports> & { readonly default :Module<Exports> };
	type ModuleFunction<Statics, Main> = Readonly<Statics & Main> & { readonly default :ModuleFunction<Statics, Main> };
	type Callable = (...args :any) => any;
	type Newable = new (...args :any) => any;
}
declare module '.default?=' { export default Default;
	function Default<Exports extends { readonly [name :string] :any, readonly default? :Module<Exports> }> (this :void, exports :Exports) :Module<Exports>;
	function Default<Statics extends { readonly [name :string] :any, readonly default? :ModuleFunction<Statics, Main> }, Main extends Callable | Newable | Callable & Newable> (this :void, main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports> & { readonly default :Module<Exports> };
	type ModuleFunction<Statics, Main> = Readonly<Statics & Main> & { readonly default :ModuleFunction<Statics, Main> };
	type Callable = (...args :any) => any;
	type Newable = new (...args :any) => any;
}

declare module '.native' { }

declare module '.null.prototype' { export default NULL;
	const NULL :object | null;
}

declare module '.throw.Error' { export default throwError;
	function throwError (this :void, message? :string, _cause_? :{ readonly cause :Error }) :never;
}

declare module '.undefined' { export default undefined; }
