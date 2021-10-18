'use strict';

const version$1 = '7.0.0';

const TypeError$1 = TypeError;

const undefined$1 = void null;

const {
	transpileModule: TypeScript_transpileModule,
	createSourceFile,
	forEachChild,
	JsxEmit: { None, Preserve, React, ReactNative, ReactJSX, ReactJSXDev },
	ScriptTarget: { ESNext },
	ScriptKind: { TS, TSX },
	SyntaxKind,
}                              = require('typescript');

const {
	TypeAliasDeclaration,
	TypeAssertionExpression,
	AsExpression,
	HeritageClause,
	FunctionExpression,
	FunctionDeclaration,
	ClassDeclaration,
	ClassExpression,
	ArrowFunction,
	MethodDeclaration,
	GetAccessor,
	SetAccessor,
	TypeParameter,
	VariableDeclaration,
	PropertyDeclaration,
	Parameter,
	QuestionToken,
	CallExpression,
	NewExpression,
	InterfaceDeclaration,
	EnumDeclaration,
	DeclareKeyword,
	Block,
	//EndOfFileToken,
	NonNullExpression,
	ModuleDeclaration,
	ReadonlyKeyword,
	PrivateKeyword,
	ProtectedKeyword,
	PublicKeyword,
	ExportAssignment,
	ImportEqualsDeclaration,
	ReturnStatement,
	ThrowStatement,
	YieldExpression,
	IndexSignature,
	AbstractKeyword,
	//NamespaceExportDeclaration,
	ExportDeclaration,
	ImportDeclaration,
	ImportClause,
	Constructor,
	ExclamationToken,
	ExpressionWithTypeArguments,
	TaggedTemplateExpression,
	OverrideKeyword,
	EqualsGreaterThanToken,
	JsxElement,
	JsxSelfClosingElement,
	JsxOpeningElement,
	JsxClosingElement,
	JsxFragment,
	JsxOpeningFragment,
	JsxClosingFragment,
	JsxAttribute,
	JsxAttributes,
	JsxSpreadAttribute,
	JsxExpression,
	JsxText,
	//JsxTextAllWhiteSpaces,
	BinaryExpression,
	CommaToken,
	Identifier,
	ObjectLiteralExpression,
	ShorthandPropertyAssignment,
	SpreadAssignment,
	PropertyAssignment,
	ComputedPropertyName,
	StringLiteral: StringLiteral$1,
	ImplementsKeyword,
	ExtendsKeyword,
	StaticKeyword,
	AsyncKeyword,
	ExportKeyword,
	ConstKeyword,///
	DefaultKeyword,///
} = SyntaxKind;

const Error$1 = Error;

let ing$1          = false;

const on$1 = ()       => {
	if ( ing$1 ) { throw Error$1(`transpiling`); }
	ing$1 = true;
};

let ts         = '';
const set_ts = (value        )       => {
	if ( typeof value!=='string' ) { throw TypeError$1(`transpileModule(!string)`); }
	ts = value;
};

let filename                    ;
const set_filename = (value                    )       => {
	if ( typeof value==='string' ) { filename = value; }
	else if ( value!==undefined$1 ) { throw TypeError$1(`transpileModule(,,!string)`); }
};

const off$2 = ()       => {
	ts = '';
	filename = undefined$1;
	ing$1 = false;
};

const test = RegExp.prototype.test;

const push = Array.prototype.push;

const apply = Reflect.apply;

let erase$2                                                           ;
const set_erase =                                                                       (value   )    => erase$2 = value;

const EOL$1 = /\r\n?|[\n\u2028\u2029]/;
const INDEX_OF_EOL = /[\n\r\u2028\u2029]/;
const INCLUDES_EOL = /*#__PURE__*/test.bind(INDEX_OF_EOL);
const WHITESPACES_AND_COMMENT = /\s|\/(?:\/.*|\*[^]*?\*\/)/gy;
const CHAR_NOT_EOL = /*#__PURE__*/test.bind(/[^\n\r/\u2028\u2029]/);
const FIRST_MAYBE_SECOND_WHITESPACE = /^[^\n\r/\u2028\u2029]{1,2}/;
const TAB_INDENT = /^(?:[\n\r\u2028\u2029]\t*)+/;
const SPACE_INDENT = /^(?:[\n\r\u2028\u2029] *)+/;

const min = (a        , b        ) => a<b ? a : b;

const slice = (start        , end         ) => ts.slice(start, end);
const codeOf = (range                        ) => ts.slice(range.pos, range.end);

const throwPosError = (pos        , message        )        => {
	if ( filename!==undefined$1 ) {
		const linesBeforeError = ts.slice(0, pos).split(EOL$1);
		const errorLineNumber = linesBeforeError.length;
		message += `\n    at (${filename}:${errorLineNumber}:${linesBeforeError[errorLineNumber - 1] .length + 1})`;
	}
	const error                           = Error$1(message);
	error.pos = pos;
	throw error;
};

const S = /\S/g;
const eraseCode = (code        ) => code.replace(S, ' ');
const eraseBetween = (start        , end        ) => ts.slice(start, end).replace(S, ' ');
const eraseRange = (range                        ) => ts.slice(range.pos, range.end).replace(S, ' ');

const LEADING_WHITESPACES_AND_COMMENT = /^(?:\s+|\/(?:\/.*|\*[^]*?\*\/))+/;
const trimBefore = (_real        ) => _real.replace(LEADING_WHITESPACES_AND_COMMENT, '');
const RealPos = ({ pos, end }                        ) => end - trimBefore(ts.slice(pos, end)).length;

const COMMENT = /\/(?:\/.*|\*[^]*?\*\/)/g;
const IndexAfterD = (beforeColon        ) => beforeColon.replace(COMMENT, eraseCode).lastIndexOf(')') + 1;

const eraseFirstGT = (_gt$        ) => {
	const gt$ = trimBefore(_gt$);
	return _gt$.slice(0, -gt$.length) + ' ' + gt$.slice(1);
};

                             
	                    
	                    
	                     
	                                          
	                                        
  
                                                        
                                           
                                                                                                           
let childNodes                    = null;
let childNodes_writable = false;
const pushNode = (node      )        => {
	if ( childNodes ) {
		if ( childNodes_writable ) { ( childNodes           )[childNodes.length] = node; }
		else {
			childNodes = [ ...childNodes, node ];
			childNodes_writable = true;
		}
	}
	else {
		childNodes = [ node ];
		childNodes_writable = true;
	}
	return false;
};
const pushNodes = (nodes                 )        => {
	if ( childNodes ) {
		if ( childNodes_writable ) { apply(push, childNodes          , nodes); }
		else {
			childNodes = [ ...childNodes, ...nodes ];
			childNodes_writable = true;
		}
	}
	else { childNodes = nodes; }
	return false;
};
const ChildNodes = (node      )                    => {
	try {
		forEachChild(node       , pushNode, pushNodes);
		return childNodes;
	}
	finally { childNodes = null; }
};
const ChildNodeN = (node      , n        )                   => forEachChild(node       , (node      ) => n ? void --n : node);
const CHILDREN = []         ;
const Children$2 = (node      )           => {
	let ts_index = node.pos;
	const childNodes = ChildNodes(node);
	if ( childNodes ) {
		const children                      = [];
		let children_length = 0;
		for ( const child of childNodes ) {
			if ( ts_index!==child.pos ) { children[children_length++] = ts.slice(ts_index, child.pos); }
			children[children_length++] = child;
			ts_index = child.end;
		}
		if ( ts_index!==node.end ) { children[children_length] = ts.slice(ts_index, node.end); }
		return children;
	}
	return ts_index===node.end ? CHILDREN : [ ts.slice(ts_index, node.end) ];
};

const search = /[A-Z]+/g;
const replacer = (A2Z        ) => A2Z.toLowerCase();
const A2a = (string        ) => string.replace(search, replacer);

const throwUnicode = (ts_index        , who        ) => {
	const _$ = slice(ts_index);
	const $ = trimBefore(_$);
	for ( const unicode of $ ) {
		throwPosError(ts_index + ( _$.length - $.length ), `${who} is interrupted by invalid character "${unicode}"`);
	}
};
const ensureD$ = (parent                                              , whose        )       => {
	parent.expression .end!==parent.end && ts[parent.end - 1]==='}' || throwPosError(parent.expression .pos - 1, `${whose} expression is not closed`);
};
const ensureGT$ = (node  
	                                                 
	                            
	                                                   
)       => {
	if ( node.pos!==node.end && ts[node.end - 1]==='>' ) { return; }
	const who =
		node.pos===node.end
			? node.kind===JsxClosingElement ? 'element' : 'fragment'
			:
				node.kind===JsxOpeningElement ? 'element opening tag' :
				node.kind===JsxClosingElement ? 'element closing tag' :
				node.kind===JsxSelfClosingElement ? 'self-closing element tag' :
				node.kind===JsxOpeningFragment ? 'fragment opening tag' :
				node.kind===JsxClosingFragment ? 'fragment closing tag' :
			'';
	const rest = trimBefore(slice(node.end));
	if ( rest ) {
		for ( const unicode of rest ) {
			throwPosError(node.pos, `${who} is ${rest ? `not closed` : `interrupted by invalid character "${unicode}"`}`);
		}
	}
	else { throwPosError(node.pos, `${who} is not closed`); }
};

function Generator$1 (            node           )                                       {
	switch ( node.kind ) {
		case JsxSelfClosingElement: return SelfClosingElementGenerator$1(node                              );
		case JsxElement: return ElementGenerator$1(node                   );
		case JsxFragment: return FragmentGenerator$1(node                    );
	}
	return null;
}
function * FragmentGenerator$1 (            node                  )                                {
	/* opening */
	ensureGT$(node.openingFragment);
	yield codeOf(node.openingFragment);
	/* children */
	if ( node.children.length ) { yield * Children$1(node); }
	/* closing */
	ensureGT$(node.closingFragment);
	yield codeOf(node.closingFragment);
}
function * SelfClosingElementGenerator$1 (            node                            )                                {
	/* opening */
	yield * Opening$1(node);
	/* closing */
	ensureGT$(node);
}
function * ElementGenerator$1 (            node                 )                                {
	/* opening */
	yield * Opening$1(node.openingElement);
	/* children */
	if ( node.children.length ) { yield * Children$1(node); }
	/* closing */
	ensureGT$(node.closingElement);
	yield codeOf(node.closingElement);
}

function * Opening$1 (            node                                                     )                                {
	const { tagName, typeArguments, attributes } = node;
	/* type */
	yield slice(node.pos, tagName.end);
	if ( typeArguments ) { yield slice(tagName.end, typeArguments.pos - 1) + eraseBetween(typeArguments.pos - 1, attributes.pos); }
	/* attributes */
	attributes.properties.length
		? yield * Attributes$1(attributes)
		: attributes.pos===attributes.end || throwUnicode(attributes.pos/*, attributes.end*/, `tag`);
	ensureGT$(node                                                       );
	yield slice(attributes.end, node.end);
}

function * Children$1 (            { children }                                    )                                {
	const { length } = children;
	let index = 0;
	do {
		const child = children[index] ;
		switch ( child.kind ) {
			case JsxText:
				yield codeOf(child);
				break;
			case JsxExpression:
				const { expression } = child;
				if ( expression ) {
					ensureD$(child, `child`);
					yield slice(child.pos, expression.pos);
					yield * erase$2(expression);
					yield slice(expression.end, child.end);
				}
				else { yield codeOf(child); }
				break;
			case JsxElement:
				yield * ElementGenerator$1(child                   );
				break;
			case JsxSelfClosingElement:
				yield * Opening$1(child                              );
				break;
			case JsxFragment:
				yield * FragmentGenerator$1(child                    );
				break;
			default:
				throw throwPosError(( child              ).pos, `@ltd/j-ts does not know about child kind ${SyntaxKind[( child              ).kind]}`);
		}
	}
	while ( ++index!==length );
}

function * Attributes$1 (            { properties }                    )                                {
	let ts_index = properties.pos;
	const lastIndex = properties.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( ; ; ) {
		const attr = properties[index] ;
		attr.pos===ts_index || throwUnicode(ts_index/*, attr.pos*/, `tag`);
		ts_index = attr.end;
		if ( attr.kind===JsxSpreadAttribute ) {
			const { expression } = attr;
			ensureD$(attr, `JsxSpreadAttribute`);
			yield slice(attr.pos, expression.pos);
			yield * erase$2(expression);
			yield slice(expression.end, ts_index);
		}
		else if ( attr.kind===JsxAttribute ) {
			const { initializer } = attr;
			if ( initializer ) {
				if ( initializer.kind===JsxExpression ) {
					ensureD$(initializer, `attribute value`);
					const { expression } = initializer;
					if ( expression ) {
						yield slice(properties.pos, expression.pos);
						yield * erase$2(expression);
						yield slice(expression.end, properties.end);
					}
					else { yield codeOf(attr); }
				}
				else {
					const _$value$ = codeOf(initializer);
					const $value$ = trimBefore(_$value$);
					const indexOfQuote = initializer.pos + ( _$value$.length - $value$.length );
					$value$.length>1 && $value$[$value$.length - 1]===$value$[0] || throwPosError(indexOfQuote, `attribute value string literal is not closed`);
					yield codeOf(attr);
				}
			}
			else {
				!attr.name || attr.name.end===properties.end || throwPosError(properties.end - 1, `there must be a quoted string or an expression after attribute =`);
				yield codeOf(attr);
			}
		}
		else { throwPosError(RealPos(attr             ), `${SyntaxKind[( attr              ).kind]}`); }
		if ( isLast ) {
			properties.end===ts_index || throwUnicode(ts_index/*, properties.end*/, `tag`);
			break;
		}
		isLast = ++index===lastIndex;
	}
}

const bind = Function.prototype.bind;

const RegExp$1 = RegExp;

const Infinity = 1/0;

const Object$1 = Object;

const throwError = (
	/*! j-globals: throw.Error (internal) */
	function throwError (message) {
		throw Error$1(message);
	}
	/*¡ j-globals: throw.Error (internal) */
);

const hasOwnProperty = Object.prototype.hasOwnProperty;

const toString = Object.prototype.toString;

const isArray = (
	/*! j-globals: Array.isArray (polyfill) */
	Array.isArray || function isArray (value) {
		return /*#__PURE__*/ toString.apply(value)==='[object Array]';
	}
	/*¡ j-globals: Array.isArray (polyfill) */
);

const has$1 = typeof Map==='undefined' ? undefined$1 : Map.prototype.has;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.seal
		? /*#__PURE__*/Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

var ARGS$1 = { length: 0 };
var hasOwn = /*#__PURE__*/function () {
	return hasOwnProperty.bind
		? hasOwnProperty.call.bind(hasOwnProperty)
		: function (object, key) { return hasOwnProperty.call(object, key); };
}();// && object!=null

const isMap = (
	/*! j-globals: class.isMap (internal) */
	has$1
		? function isMap (value) {
			try { apply(has$1, value, ARGS$1); }
			catch (error) { return false; }
			return true;
		}
		: function isMap () { return false; }
	/*¡ j-globals: class.isMap (internal) */
);

const has = typeof Set==='undefined' ? undefined$1 : Set.prototype.has;

const isSet = (
	/*! j-globals: class.isSet (internal) */
	has
		? function isSet (value) {
			try { apply(has, value, ARGS$1); }
			catch (error) { return false; }
			return true;
		}
		: function isSet () { return false; }
	/*¡ j-globals: class.isSet (internal) */
);

const valueOf = Date.prototype.valueOf;

const isDate = (
	/*! j-globals: class.isDate (internal) */
	function isDate (value) {
		try { apply(valueOf, value, ARGS$1); }
		catch (error) { return false; }
		return true;
	}
	/*¡ j-globals: class.isDate (internal) */
);

var ARGS = { length: 1, 0: '' };
const isRegExp = (
	/*! j-globals: class.isRegExp (internal) */
	function isRegExp (value) {
		try { apply(test, value, ARGS); }
		catch (error) { return false; }
		return true;
	}
	/*¡ j-globals: class.isRegExp (internal) */
);

const create = Object.create;

const toStringTag = typeof Symbol==='undefined' ? undefined$1 : Symbol.toStringTag;

const defineProperty = Object.defineProperty;

const freeze = Object.freeze;

const assign = Object.assign;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(NULL); }
		if ( assign ) { assign(exports, addOnOrigin); }
		else { for ( var key in addOnOrigin ) { if ( hasOwn(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
		exports.default = exports;
		if ( toStringTag ) {
			var descriptor = create(NULL);
			descriptor.value = 'Module';
			defineProperty(exports, toStringTag, descriptor);
		}
		typeof exports==='function' && exports.prototype && freeze(exports.prototype);
		return freeze(exports);
	}
	/*¡ j-globals: default (internal) */
);

/*!@preserve@license
 * 模块名称：j-es
 * 模块功能：ECMAScript 语法相关共享实用程序。从属于“简计划”。
   　　　　　ECMAScript syntax util. Belong to "Plan J".
 * 模块版本：0.12.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-es/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-es/
 */

var version = '0.12.0';

var RESERVED_WORD_ES3 = /^(?:break|c(?:a(?:se|tch)|lass|on(?:st|tinue))|d(?:o|e(?:bugger|fault|lete))|e(?:lse|num|x(?:port|tends))|f(?:alse|inally|or|unction)|i(?:f|mport|n(?:stanceof)?)|n(?:ew|ull)|return|s(?:uper|witch)|t(?:h(?:is|row)|r(?:y|ue)|ypeof)|v(?:ar|oid)|w(?:hile|ith))$/;

var RESERVED_WORD_ESM = /^(?:arguments|break|c(?:a(?:se|tch)|lass|on(?:st|tinue))|d(?:o|e(?:bugger|fault|lete))|e(?:lse|num|val|x(?:port|tends))|f(?:alse|inally|or|unction)|i(?:f|mp(?:lements|ort)|n(?:stanceof|terface)?)|let|n(?:ew|ull)|p(?:ackage|r(?:ivate|otected)|ublic)|return|s(?:tatic|uper|witch)|t(?:h(?:is|row)|r(?:y|ue)|ypeof)|v(?:ar|oid)|w(?:hile|ith)|yield)$/;

var IDENTIFIER_NAME_ES6 = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDEC0-\uDEEB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D3-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDD30-\uDD39\uDF00-\uDF1C\uDF27\uDF30-\uDF50\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD46\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E\uDC5F\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCE9\uDCFF\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/;

var IDENTIFIER_NAME_ES5 = /^[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u021F\u0222-\u0233\u0250-\u02AD\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u037A\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D7\u03DA-\u03F3\u0400-\u0481\u048C-\u04C4\u04C7\u04C8\u04CB\u04CC\u04D0-\u04F5\u04F8\u04F9\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0640-\u064A\u0671-\u06D3\u06D5\u06E5\u06E6\u06FA-\u06FC\u0710\u0712-\u072C\u0780-\u07A5\u0905-\u0939\u093D\u0950\u0958-\u0961\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60\u0D61\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6A\u0F88-\u0F8B\u1000-\u1021\u1023-\u1027\u1029\u102A\u1050-\u1055\u10A0-\u10C5\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1206\u1208-\u1246\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1286\u1288\u128A-\u128D\u1290-\u12AE\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12CE\u12D0-\u12D6\u12D8-\u12EE\u12F0-\u130E\u1310\u1312-\u1315\u1318-\u131E\u1320-\u1346\u1348-\u135A\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u1780-\u17B3\u1820-\u1877\u1880-\u18A8\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u207F\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2131\u2133-\u2139\u2160-\u2183\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303A\u3041-\u3094\u309D\u309E\u30A1-\u30FA\u30FC-\u30FE\u3105-\u312C\u3131-\u318E\u31A0-\u31B7\u3400-\u4DB5\u4E00-\u9FA5\uA000-\uA48C\uAC00-\uD7A3\uF900-\uFA2D\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u021F\u0222-\u0233\u0250-\u02AD\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0300-\u034E\u0360-\u0362\u037A\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D7\u03DA-\u03F3\u0400-\u0481\u0483-\u0486\u048C-\u04C4\u04C7\u04C8\u04CB\u04CC\u04D0-\u04F5\u04F8\u04F9\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF\u05C1\u05C2\u05C4\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0640-\u0655\u0660-\u0669\u0670-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u06F0-\u06FC\u0710-\u072C\u0730-\u074A\u0780-\u07B0\u0901-\u0903\u0905-\u0939\u093C-\u094D\u0950-\u0954\u0958-\u0963\u0966-\u096F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A02\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A59-\u0A5C\u0A5E\u0A66-\u0A74\u0A81-\u0A83\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3C-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE7-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C60\u0C61\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D66-\u0D6F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC\u0EDD\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6A\u0F71-\u0F84\u0F86-\u0F8B\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1021\u1023-\u1027\u1029\u102A\u102C-\u1032\u1036-\u1039\u1040-\u1049\u1050-\u1059\u10A0-\u10C5\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1206\u1208-\u1246\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1286\u1288\u128A-\u128D\u1290-\u12AE\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12CE\u12D0-\u12D6\u12D8-\u12EE\u12F0-\u130E\u1310\u1312-\u1315\u1318-\u131E\u1320-\u1346\u1348-\u135A\u1369-\u1371\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u1780-\u17D3\u17E0-\u17E9\u1810-\u1819\u1820-\u1877\u1880-\u18A9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u207F\u20D0-\u20DC\u20E1\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2131\u2133-\u2139\u2160-\u2183\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303A\u3041-\u3094\u3099\u309A\u309D\u309E\u30A1-\u30FE\u3105-\u312C\u3131-\u318E\u31A0-\u31B7\u3400-\u4DB5\u4E00-\u9FA5\uA000-\uA48C\uAC00-\uD7A3\uF900-\uFA2D\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE20-\uFE23\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF65-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]*$/;

var IDENTIFIER_NAME_ES3 = /^[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u01F5\u01FA-\u0217\u0250-\u02A8\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u037A\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D6\u03DA\u03DC\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E-\u0481\u0490-\u04C4\u04C7\u04C8\u04CB\u04CC\u04D0-\u04EB\u04EE-\u04F5\u04F8\u04F9\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0640-\u064A\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D3\u06D5\u06E5\u06E6\u0905-\u0939\u093D\u0950\u0958-\u0961\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60\u0D61\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F69\u0F88-\u0F8B\u10A0-\u10C5\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u207F\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3041-\u3094\u309D\u309E\u30A1-\u30FA\u30FC-\u30FE\u3105-\u312C\u3131-\u318E\u4E00-\u9FA5\uAC00-\uD7A3\uF900-\uFA2D\uFB00-\uFB06\uFB13-\uFB17\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u01F5\u01FA-\u0217\u0250-\u02A8\u02B0-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u0300-\u0345\u0360\u0361\u037A\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D6\u03DA\u03DC\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E-\u0481\u0483-\u0486\u0490-\u04C4\u04C7\u04C8\u04CB\u04CC\u04D0-\u04EB\u04EE-\u04F5\u04F8\u04F9\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF\u05C1\u05C2\u05C4\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0640-\u0652\u0660-\u0669\u0670-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0901-\u0903\u0905-\u0939\u093C-\u094D\u0950-\u0954\u0958-\u0963\u0966-\u096F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A02\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A59-\u0A5C\u0A5E\u0A66-\u0A74\u0A81-\u0A83\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B36-\u0B39\u0B3C-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE7-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C60\u0C61\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D66-\u0D6F\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC\u0EDD\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F69\u0F71-\u0F84\u0F86-\u0F8B\u0F90-\u0F95\u0F97\u0F99-\u0FAD\u0FB1-\u0FB7\u0FB9\u10A0-\u10C5\u10D0-\u10F6\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u207F\u20D0-\u20DC\u20E1\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3041-\u3094\u3099\u309A\u309D\u309E\u30A1-\u30FE\u3105-\u312C\u3131-\u318E\u4E00-\u9FA5\uAC00-\uD7A3\uF900-\uFA2D\uFB00-\uFB06\uFB13-\uFB17\uFB1E-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE20-\uFE23\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE72\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF65-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]*$/;

var Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC38]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/g;

var _Infinity = -Infinity;

var is                                                = Object$1.is || function is (value        ) { return value===0 && 1/value<0; };
function NumericLiteral (value        )         {
	return value===Infinity || value===_Infinity || value!==value
		? /*#__PURE__*/ throwError('NumericLiteral('+value+')')
		: ( is(value, -0) ? '-' : '' )+value;
}

var CANT_IN_SINGLE_QUOTE = /[\n\r'\\\u2028\u2029]/g;
function staticallyEscape (cant_in_single_quote                              )         {
	return CHAR_TO_ESCAPED[cant_in_single_quote];
}

var CHAR_TO_ESCAPED = { '\n': '\\n', '\r': '\\r', '\'': '\\\'', '\\': '\\\\', '\u2028': '\\u2028', '\u2029': '\\u2029' };
function dynamicallyEscape (char_in_cf        )         {
	if ( char_in_cf.length>1 ) {
		return dynamicallyEscape(char_in_cf.charAt(0))+dynamicallyEscape(char_in_cf.charAt(1));
	}
	var hex         = char_in_cf.charCodeAt(0).toString(16).toUpperCase();
	switch ( hex.length ) {
		case 4:
			return '\\u'+hex;
		case 3:
			return '\\u0'+hex;
		case 2:
			return '\\x'+hex;
	}
	return '\\x0'+hex;
}

                                           

function StringLiteral (value        )         {
	return '\''
		+value
		.replace(CANT_IN_SINGLE_QUOTE, staticallyEscape            )
		.replace(Cf, dynamicallyEscape            )
		+'\'';
}

var EOL = /\\[^\s\S]|[\n\r\/\u2028\u2029]/g;
function EOL_replacer (part        ) {
	switch ( part ) {
		case '\n':
		case '\\\n':
			return '\\n';
		case '\r':
		case '\\\r':
			return '\\r';
		case '/':
			return '\\/';
		case '\u2028':
		case '\\\u2028':
			return '\\u2028';
		case '\u2029':
		case '\\\u2029':
			return '\\u2029';
	}
	return part;
}
var AS_ES5 = ''+RegExp$1('')==='//' || ''+RegExp$1('/')==='///' || ''+RegExp$1('\n')==='/\n/'
	? function AS_ES5 (literal        ) {
		var index         = literal.length;
		while ( literal.charAt(--index)!=='/' ) { }
		var source         = literal.slice(1, index);
		source = source ? source.replace(EOL, EOL_replacer) : '(?:)';
		return '/'+source+literal.slice(index);
	}
	: function (literal        ) { return literal; };
var MAYBE_ES3 = /\/[gim]*$/;
var SLASH_NUL = /(?!^)\/(?![a-z]*$)|\x00|\\[\s\S]/g;
function SLASH_NUL_replacer (part        ) { return part==='\x00' ? '\\x00' : part==='/' ? '\\/' : part; }
function RegularExpressionLiteral (value        )         {
	var literal         = AS_ES5(''+value);
	return MAYBE_ES3.test(literal)
		? literal.replace(Cf, dynamicallyEscape            ).replace(SLASH_NUL, SLASH_NUL_replacer)
		: literal;
}

function BigIntLiteral (value        )         {
	return value+'n';
}

var test_bind = bind
	? /*#__PURE__*/ bind.bind(test)                                                                       
	: function (            re        ) {
		return function (            string        ) {
			return test.call(re, string);
		};
	};

var IS_LIKE_SAFE_INTEGER = /*#__PURE__*/ test_bind(/^(?:0|[1-9]\d{0,15})$/);
var IS_LIKE_ARRAY_INDEX = /*#__PURE__*/ test_bind(/^(?:0|[1-4]\d{0,9}|[5-9]\d{0,8})$/);
function isArrayIndex (key        )          {
	return IS_LIKE_ARRAY_INDEX(key) && key       <4294967295;
}
function isIntegerIndex (key        )          {
	return IS_LIKE_SAFE_INTEGER(key) && key       <=9007199254740991;
}
var IS_RESERVED_WORD_ES3 = /*#__PURE__*/ test_bind(RESERVED_WORD_ES3);
var IS_RESERVED_WORD_ESM = /*#__PURE__*/ test_bind(RESERVED_WORD_ESM);
function isReservedWord (name        , noStrict          )          {
	return noStrict
		? IS_RESERVED_WORD_ES3(name)
		: IS_RESERVED_WORD_ESM(name);
}
var IS_IDENTIFIER_NAME_ES6 = /*#__PURE__*/ test_bind(IDENTIFIER_NAME_ES6);
var IS_IDENTIFIER_NAME_ES3 = /*#__PURE__*/ test_bind(IDENTIFIER_NAME_ES3);
var IS_IDENTIFIER_NAME_ES5 = /*#__PURE__*/ test_bind(IDENTIFIER_NAME_ES5);
function isIdentifierName (name        , ES         )          {
	if ( ES ) {
		if ( ES>=6 ) { return IS_IDENTIFIER_NAME_ES6(name); }
		if ( ES>=5 ) { return IS_IDENTIFIER_NAME_ES5(name); }
	}
	return IS_IDENTIFIER_NAME_ES3(name);
}
function isIdentifier (id        , ES         , noStrict          )          {
	return isIdentifierName(id, ES) && !isReservedWord(id, noStrict);
}
function isPropertyName (key        , ES         )          {
	return isIdentifierName(key, ES)
		? ES >=5 || !IS_RESERVED_WORD_ES3(key)
		: isIntegerIndex(key);
}
function PropertyName (key        , ES         )         {
	return isPropertyName(key, ES) ? key : StringLiteral(key);// ['__proto__']
}
function PropertyAccessor (key        , ES         )         {
	if ( isIdentifierName(key, ES) ) { if ( ES >=5 || !IS_RESERVED_WORD_ES3(key) ) { return '.' + key; } }
	else { if ( isIntegerIndex(key) ) { return '[' + key + ']'; } }
	return '[' + StringLiteral(key) + ']';
}
function PropertyAccessors (keys          , ES         )         {
	var propertyAccessors         = '';
	for ( var length = keys.length, index = 0; index<length; ++index ) {
		propertyAccessors += PropertyAccessor(keys[index] , ES);
	}
	return propertyAccessors;
}

function Primitive                                       
	                 
		                   
		                  
		             
	     
		                                     
			              
			                                                      
			                  
			               
		           
	   (
	value                      ,
	key              ,
	object        ,
	options         
)         {
	switch ( value ) {
		case null:
			return 'null';
		case true:
			return 'true';
		case false:
			return 'false';
		case undefined$1:
			return options.undefined || '';
		case Infinity:
			return options.Infinity || '';
		case _Infinity:
			return options.Infinity ? '-'+options.Infinity : '';
	}
	if ( value!==value ) { return options.NaN || ''; }
	switch ( typeof value ) {
		case 'number':
			return ( is(value, -0) ? '-' : '' )+value;
		case 'string':
			return StringLiteral(value);
		case 'bigint':
			return options.bigint ? options.bigint(value, key, object) : '';
		case 'object':
			return (
				options.Array && isArray(value) ? options.Array(value, key, object) :
					options.Map && isMap(value) ? options.Map(value, key, object) :
						options.Set && isSet(value) ? options.Set(value, key, object) :
							options.Date && isDate(value) ? options.Date(value, key, object) :
								options.RegExp && isRegExp(value) ? options.RegExp(value, key, object) :
									options.object ? options.object(value, key, object) : ''
			);
		case 'function':
			return options['function'] ? options['function'](value, key, object) : '';
		case 'symbol':
			return options.symbol ? options.symbol(value, key, object) : '';
	}
	return options.unknown ? options.unknown(value, key, object) : '';
}

function ObjectLiteral (object                        , options   
	            
	                                          
	                                           
	                  
	                                            
	                     
	                                           
	                                           
	                   
 )         {
	var pairs           = [];
	var pairs_length         = 0;
	var open         = '{';
	var close         = '}';
	var _colon_         = ( options.key_colon || '' )+':'+( options.colon_value || '' );
	var ES         = options.ES || 0;
	for ( var key in object ) {
		if ( hasOwnProperty.call(object, key) ) {
			var value = Primitive(object[key                ], key, object, options      );
			if ( value ) {
				if ( key==='__proto__' && !options.__safe__ ) {
					if ( ES>=6 ) { key = '[\'__proto__\']'       ; }
					else {
						open = '/*#__PURE__*/function(p,o){o.__proto__=_.p;return o}({'+( options.open_first || '' )+'p'+_colon_+value+( options.last_close || '' )+'},{';
						close = '})';
						value = 'null';
					}
				}
				else { key = PropertyName(key, ES)       ; }
				pairs[pairs_length++] = key+_colon_+value;
			}
		}
	}
	return open+(
		pairs_length
			? ( options.open_first || '' )+pairs.join(( options.value_comma || '' )+','+( options.comma_next || '' ))+( options.last_close || '' )
			: ( options.open_close || '' )
	)+close;
}

function ArrayLiteral (
	array                 ,
	options   
		            
		                                   
		                                    
		                    
		                                    
		                                    
	 
)         {
	var items          ;
	var length = array.length;
	if ( length===1 ) {
		var item = Primitive(array[0], 0, array, options      );
		if ( item || options.ES >=5 ) { items = [ item ]; }
		else {
			return '/*#__PURE__*/function(){var a=['+( options.open_first || '' )+( options.last_close || '' )+'];a.length=1;return a}()';
		}
	}
	else {
		items = [];
		for ( var index = 0; index<length; ++index ) {
			items[index] = Primitive(array[index], index, array, options      );
		}
	}
	return '['+(
		items.length
			? ( options.open_first || '' )+items.join(( options.item_comma || '' )+','+( options.comma_next || '' ))+( options.last_close || '' )
			: options.open_close || ''
	)+']';
}

var IS_SAFE = /*#__PURE__*/ test_bind(/^[`~!@#%^&*()\-=+[{\]}\\|;:'",<.>\/?\s]/);

function exportify (
	object     ,
	options   
		            
		                              
		                          
		                     
		                    
		                    
		                   
		                     
		                     
		                    
		                    
		                         
		                        
		                       
		                   
	 
)         {
	if ( typeof object!=='object' || object===null || isArray(object) || isMap(object) || isSet(object) || isDate(object) || isRegExp(object) ) {
		var $default$ = Primitive(object, undefined$1       , undefined$1       , options      );
		if ( $default$ ) {
			$default$ = ( options.default_value || '' ) + $default$;
			return ( IS_SAFE($default$) ? 'export default' + $default$ : 'export default ' + $default$ ) + ( options.value_semicolon || '' ) + ';';
		}
		return '';
	}
	var ES         = options.ES || 0;
	var gteES6          = ES>=6;
	var export_$_ = 'export ' + ( options['let'] || ( gteES6 ? 'const' : 'var' ) ) + ' ';
	var _equal_         = ( options.identifier_equal || '' ) + '=' + ( options.equal_value || '' );
	var _colon_         = ( options.key_colon || '' ) + ':' + ( options.colon_value || '' );
	var semicolon_         = ( options.value_semicolon || '' ) + ';' + ( options.semicolon_next || '' );
	var named         = '';
	var pairs           = [];
	var pairs_length         = 0;
	var open         = '{';
	var close         = '}';
	for ( var key in object ) {
		if ( hasOwnProperty.call(object, key) ) {
			var value = Primitive(object[key], key, object, options      );
			if ( value ) {
				if ( isIdentifier(key, ES) ) {
					named += export_$_ + key + _equal_ + value + semicolon_;
					if ( gteES6 ) { pairs[pairs_length++] = key; }
					else if ( key==='__proto__' && !options.__safe__ ) {
						open = '/*#__PURE__*/function(o){o.__proto__=__proto__;return o}({';
						close = '})';
						pairs[pairs_length++] = '__proto__' + _colon_ + 'null';
					}
					else { pairs[pairs_length++] = key + _colon_ + key; }
				}
				else { pairs[pairs_length++] = PropertyName(key, ES) + _colon_ + value; }
			}
		}
	}
	return named +
		'export default' + ( options.default_value || '' ) + open + (
			pairs_length
				? ( options.open_first || '' ) + pairs.join(( options.value_comma || '' ) + ',' + ( options.comma_next || '' )) + ( options.last_close || '' )
				: ( options.open_close || '' )
		) + close + ';';
}

Default({
	
	version: version,
	
	isReservedWord: isReservedWord,
	
	isIdentifierName: isIdentifierName,
	isIdentifier: isIdentifier,
	isArrayIndex: isArrayIndex,
	isIntegerIndex: isIntegerIndex,
	isPropertyName: isPropertyName,
	PropertyName: PropertyName,
	PropertyAccessor: PropertyAccessor,
	PropertyAccessors: PropertyAccessors,
	
	StringLiteral: StringLiteral,
	NumericLiteral: NumericLiteral,
	BigIntLiteral: BigIntLiteral,
	RegularExpressionLiteral: RegularExpressionLiteral,
	
	ObjectLiteral: ObjectLiteral,
	ArrayLiteral: ArrayLiteral,
	
	exportify: exportify
	
});

/*¡ j-es */

let credit         = 0;
let jsxFactory                    ;
let jsxFragmentFactory                    ;

const AMP_OR_BACKSLASH = /[&\\]/;
const text2string = (value        , ts_index        )         => {
	const indexOfAMP = value.search(AMP_OR_BACKSLASH);
	return indexOfAMP<0 ? StringLiteral(value) : throwPosError(ts_index + indexOfAMP, ``);
};
const needCD = (expression                 ) => expression.kind===BinaryExpression && ( expression                          ).operatorToken.kind===CommaToken;
const notMin = /*#__PURE__*/test.bind(/[\s/]/);
const couldNotNotString = /*#__PURE__*/test.bind(/[-:]/);
const NO_ATTRIBUTE = /*#__PURE__*/test.bind(/^{\s*}\s*$/);

const coverCode = (dist        , src        )         => {
	const index = src.search(INDEX_OF_EOL);
	if ( index<0 ) {
		const surplus = src.length - dist.length;
		if ( surplus>credit ) {
			dist += eraseCode(src.slice(dist.length + credit));
			credit = 0;
		}
		else { credit -= surplus; }
	}
	else {
		dist += eraseCode(src.slice(min(index, dist.length)));
		credit = 0;
	}
	return dist;
};
const coverBetween = (dist        , srcStart        , srcEnd        )         => coverCode(dist, ts.slice(srcStart, srcEnd));
const coverRange = (dist        , srcRange                        )         => coverCode(dist, ts.slice(srcRange.pos, srcRange.end));
const resetIfNewline = (code        ) => {
	if ( credit && INCLUDES_EOL(code) ) { credit = 0; }
};

const noReasonNotString = /*#__PURE__*/test.bind(/^[a-z][^.]*$/);
const GENERATE_START                = (value, index) =>
	value
		? value==='this'
			? throwPosError(index - 1, `tag name should better not be "this", because it should be an intrinsic element according to the current react jsx spec/docs, but is a value-based element in typescript and babel in fact for historical reason, so please use it more exactly via a variable`)
			: noReasonNotString(value) || couldNotNotString(value)
				? ts[index + value.length]==='<' ? throwPosError(index - 1, `intrinsic element cannot has type arguments`) : `${jsxFactory}('${value}',`
				: `${jsxFactory}(${value},`
		: `${jsxFactory}(${jsxFragmentFactory },null,`;
let generateStart                = GENERATE_START;

const off$1 = ()       => {
	jsxFactory = jsxFragmentFactory = undefined$1;
	generateStart = GENERATE_START;
};
                                                                                                                
const on = (jsx               )       => {
	generateStart = jsx;
};
                               
	                             
	                                     
	                                 
              
const on$ = (compilerOptions                 )       => {
	jsxFactory = compilerOptions?.jsxFactory;
	jsxFragmentFactory = compilerOptions?.jsxFragmentFactory;
	let reactNamespace                    ;
	if ( jsxFactory===undefined$1 ) {
		reactNamespace = compilerOptions?.reactNamespace;
		if ( reactNamespace===undefined$1 ) { reactNamespace = 'React'; }
		else if ( typeof reactNamespace!=='string' ) { throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react',reactNamespace:!string}})`); }
		jsxFragmentFactory = reactNamespace + '.createElement';
	}
	else if ( typeof jsxFactory!=='string' ) { throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react',jsxFactory:!string}})`); }
	if ( jsxFragmentFactory===undefined$1 ) {
		if ( reactNamespace===undefined$1 ) {
			reactNamespace = compilerOptions?.reactNamespace;
			if ( reactNamespace===undefined$1 ) { reactNamespace = 'React'; }
			else if ( typeof reactNamespace!=='string' ) { throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react',reactNamespace:!string}})`); }
		}
		jsxFragmentFactory = reactNamespace + '.Fragment';
	}
	else if ( typeof jsxFragmentFactory!=='string' ) { throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react',jsxFragmentFactory:!string}})`); }
	generateStart = GENERATE_START;
};

function Generator (            node           )                                       {
	switch ( node.kind ) {
		case JsxSelfClosingElement: return SelfClosingElementGenerator(node                              , true);
		case JsxElement: return ElementGenerator(node                   , true);
		case JsxFragment: return FragmentGenerator(node                    , true);
	}
	return null;
}

function * FragmentGenerator (            node                  , reset         )                                {
	// openingFragment: JsxOpeningFragment [ " < >" ]
	// children: ... JsxText | JsxExpression | Jsx3
	// closingFragment: JsxClosingFragment [ "</ >" ]
	if ( reset ) { credit = 0; }
	/* opening */
	ensureGT$(node.openingFragment);
	const _real = codeOf(node.openingFragment);
	const real = trimBefore(_real);
	yield coverCode(``, _real.slice(0, -real.length));
	const start = generateStart('', node.openingFragment.end - real.length);
	if ( typeof start!=='string' ) { throw TypeError$1(`transpileModule(,jsx) must return a string`); }
	let needComma = true;
	switch ( start[start.length - 1] ) {
		case ',': break;
		case '(': needComma = false; break;
		default: throw TypeError$1(`transpileModule(,jsx) must return string endsWith "," or "("`);
	}
	if ( INCLUDES_EOL(start) ) { throw Error$1(`transpileModule(,jsx) must return single line string`); }
	yield coverCode(needComma ? start.slice(0, -1) : start, real);
	/* children */
	if ( node.children.length ) { yield * Children(needComma ? ',' : '', node); }
	/* closing */
	ensureGT$(node.closingFragment);
	yield coverRange(`)`, node.closingFragment);
	if ( reset ) { credit = 0; }
}
function * SelfClosingElementGenerator (            node                            , reset         )                                {
	// " <"
	// ThisKeyword [ " this" ] | Identifier [ " $" ] | PropertyAccessExpression [ ThisKeyword|Identifier|PropertyAccessExpression " ." Identifier ]
	//  " <"?
	//  $?
	//  " >"?
	// JsxAttributes
	// " / >"
	if ( reset ) { credit = 0; }
	/* opening */
	yield * Opening(node, `)`);
	/* closing */
	ensureGT$(node);
	if ( reset ) { credit = 0; }
}
function * ElementGenerator (            node                 , reset         )                                {
	// JsxOpeningElement
	// ... JsxText | JsxExpression
	// JsxClosingElement [ "</" ThisKeyword|Identifier|PropertyAccessExpression " >" ]
	if ( reset ) { credit = 0; }
	/* opening */
	const tag_min = yield * Opening(node.openingElement, ``);
	/* children */
	if ( node.children.length ) { yield * Children(',', node); }
	/* closing */
	ensureGT$(node.closingElement);
	ts.startsWith(`</${tag_min}>`, node.closingElement.pos) || throwPosError(node.closingElement.pos, `the closing tag should better have verbatim same name with opening tag, and without any whitespace or comment in`);
	yield coverRange(`)`, node.closingElement);
	if ( reset ) { credit = 0; }
}

function * Opening (            node                                                     , after          )                                  {
	// " <"
	// ThisKeyword | Identifier | PropertyAccessExpression
	// " <"?
	// $?
	// " >"?
	// JsxAttributes
	// " / >" | " >"
	const { tagName, attributes } = node;
	yield coverBetween('', node.pos, tagName.pos - 1);
	const tag_min = codeOf(tagName);
	notMin(tag_min) && throwPosError(tagName.pos - 1, `whitespaces and comments should better not appear in tag name`);
	const indexOfBackslash = tag_min.indexOf('\\');
	indexOfBackslash<0 || throwPosError(tagName.pos + indexOfBackslash, `tag name should better not contain UnicodeEscapeSequence`);
	node.typeArguments && tagName.end + 1!==node.typeArguments.pos && throwPosError(tagName.pos - 1, `whitespaces and comments should better not appear between tag name and type argument`);
	const start = generateStart(tag_min, tagName.pos);
	if ( typeof start!=='string' ) { throw TypeError$1(`transpileModule(,jsx) must return a string`); }
	switch ( start[start.length - 1] ) {
		case ',': break;
		case '(': break;
		default: throw TypeError$1(`transpileModule(,jsx) must return string endsWith "," or "("`);
	}
	if ( INCLUDES_EOL(start) ) { throw Error$1(`transpileModule(,jsx) must return single line string`); }
	yield coverBetween(start, tagName.pos - 1, attributes.pos);
	if ( attributes.properties.length ) {
		const old = credit;
		const js = [ ...Attributes(attributes) ].join('');
		if ( NO_ATTRIBUTE(js) ) {
			credit = old;
			yield coverRange('null', attributes);
		}
		else { yield js; }
	}
	else {
		attributes.pos===attributes.end || throwUnicode(attributes.pos/*, attributes.end*/, `tag`);
		yield coverRange('null', attributes);
	}
	ensureGT$(node);
	yield coverBetween(after, attributes.end, node.end);
	return tag_min;
}

function * Children (            before          , { children }                                    )                                {
	const lastIndex = children.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( let TEXT = ''; ; before = ',' ) {
		const child = children[index] ;
		switch ( child.kind ) {
			case JsxText:
				// === JsxText:
				// " &lt; "
				const text = codeOf(child);
				const rest = text.replace(text.includes('\t') ? TAB_INDENT : SPACE_INDENT, '');
				if ( rest ) {
					throw throwPosError(child.end - rest.length, `there should better not be JsxText except indents`);
				}
				TEXT += text;
				break;
			case JsxExpression:
				// === JsxExpression:
				// "{" $ " }" | "{ }"
				const { expression } = child;
				if ( expression ) {
					child.dotDotDotToken && throwPosError(child.dotDotDotToken.end - 3, `child expression can not start with "..."`);
					ensureD$(child, `child`);
					const CD = needCD(expression);
					yield coverCode(`${before}${CD ? '(' : ''}`, `${TEXT} `);
					yield * erase$2(expression);
					resetIfNewline(codeOf(expression));
					yield coverBetween(CD ? ')' : '', expression.end, child.end);
				}
				else { yield coverCode('', TEXT + codeOf(child)); }
				TEXT = '';
				break;
			case JsxElement:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * ElementGenerator(child                   , false);
				break;
			case JsxSelfClosingElement:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * SelfClosingElementGenerator(child                              , false);
				break;
			case JsxFragment:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * FragmentGenerator(child                    , false);
				break;
			default:
				throw throwPosError(( child              ).pos, `@ltd/j-ts does not know about child kind ${SyntaxKind[( child              ).kind]}`);
		}
		if ( isLast ) {
			if ( TEXT ) { yield coverCode('', TEXT); }
			break;
		}
		isLast = ++index===lastIndex;
	}
}

function * Attributes (            { properties }                    )                                {
	let ts_index = properties.pos;
	const lastIndex = properties.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( let beforeEach            = '{'; ; beforeEach = ',' ) {
		const afterEach = isLast ? '}' : '';
		const attr = properties[index] ;
		attr.pos===ts_index || throwUnicode(ts_index/*, attr.pos*/, `tag`);
		ts_index = attr.end;
		if ( attr.kind===JsxSpreadAttribute ) {
			// === JsxSpreadAttribute:
			// " { ..."
			// $
			// " }"
			const { expression } = attr;
			ts.endsWith('...', expression.pos - 3) || throwPosError(expression.pos, `JsxSpreadAttribute must start with "..."`);
			ensureD$(attr, `JsxSpreadAttribute`);
			expression.pos===expression.end && throwPosError(expression.pos, `JsxSpreadAttribute can not be empty`);
			if ( expression.kind===ObjectLiteralExpression ) {
				// === " { _ , _ , }"
				// " {"
				// ... `${ _} ,${ _} ,`
				// " }"
				const { properties } = expression                                ;
				const { length } = properties;
				if ( length ) {
					for ( const property of properties ) {
						switch ( property.kind ) {
							case ShorthandPropertyAssignment:
							case SpreadAssignment:
							case MethodDeclaration:
								break;
							case PropertyAssignment:
								switch ( property.name.kind ) {
									case ComputedPropertyName:
										break;
									case StringLiteral$1:
										property.name.text==='__proto__' && throwPosError(RealPos(property.name), `@ltd/j-ts does not know what to do for "'__proto__':" while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
										break;
									case Identifier:
										property.name.escapedText==='___proto__' && throwPosError(RealPos(property.name), `"@ltd/j-ts does not know what to do for "__proto__:" while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
										break;
									default:
										throw throwPosError(RealPos(property.name), `@ltd/j-ts does not know ${SyntaxKind[property.name.kind]} PropertyAssignment while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
								}
								break;
							case GetAccessor:
							case SetAccessor:
								break;
							default:
								throw throwPosError(RealPos(property), `@ltd/j-ts does not know ${SyntaxKind[( property              ).kind]} while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
						}
					}
					let property = properties[0] ;
					const firstPropertyPOS = property.pos;
					yield coverBetween(beforeEach, attr.pos, firstPropertyPOS);
					for ( let index = 0; ; ) {
						yield * erase$2(property);
						if ( ++index===length ) { break; }
						yield slice(property.end, ( property = properties[index]  ).pos);
					}
					resetIfNewline(slice(firstPropertyPOS, property.end));
					yield coverBetween(afterEach, property.end, ts_index);
				}
				else { yield coverBetween(`${beforeEach}${afterEach}`.replace(',', ''), attr.pos, ts_index); }
			}
			else {
				needCD(expression) && throwPosError(( expression                          ).operatorToken.end - 1, `invalid "," in JsxSpreadAttribute expression`);
				yield coverBetween(beforeEach, attr.pos, expression.pos - 3) + '...';
				yield * erase$2(expression);
				resetIfNewline(codeOf(expression));
				yield coverBetween(afterEach, expression.end, ts_index);
			}
		}
		else {
			// === JsxAttribute:
			// Identifier [ " $" ]
			const { name, initializer } = attr;
			name || throwPosError(attr.pos, `attribute name can not be empty`);
			const _name = codeOf(name);
			const real = trimBefore(_name);
			const _ = _name.slice(0, -real.length) || throwPosError(name.pos, `there should better be at least one whitespace before attribute name`);
			_[0]==='/' && throwPosError(name.pos, `comments in tag should better be surrounded by at least one whitespace on each side`);
			_[_.length - 1]==='/' && throwPosError(name.pos + _.length, `comments in tag should better be surrounded by at least one whitespace on each side`);
			const indexOfBackslash = real.indexOf('\\');
			indexOfBackslash<0 || throwPosError(name.pos + _.length + indexOfBackslash, `attribute name should better not contain UnicodeEscapeSequence`);/// or at least throw invalid (syntax, range, __proto__, '')
			real==='__proto__' && throwPosError(name.pos + _.length, `attribute name should better not be "__proto__", because it should be a normal property, but is a magic name in fact and not be handled by other transpiler like typescript and babel`);
			const $name$ = couldNotNotString(real) ? `'${real}'`: real;
			if ( initializer ) {
				const indexOfBackslash = slice(name.end, initializer.pos).indexOf('/');
				indexOfBackslash<0 || throwPosError(name.end + indexOfBackslash, `there should better not be comments on any side of =`);
				if ( initializer.kind===JsxExpression ) {
					// " ="
					// JsxExpression [ " {" $ " }" ]
					initializer.dotDotDotToken && throwPosError(initializer.dotDotDotToken.end - 3, `attribute value expression can not start with "..."`);
					const expression = initializer.expression || throwPosError(initializer.end - 1, `attribute value expression can not be empty`);
					const indexOfBackslash = slice(initializer.pos, expression.pos - 1).indexOf('/');
					indexOfBackslash<0 || throwPosError(initializer.pos + indexOfBackslash, `there should better not be comments on any side of =`);
					ensureD$(initializer, `attribute value`);
					const CD = needCD(expression);
					yield coverBetween(`${beforeEach}${$name$}:${CD ? '(' : ''}`, attr.pos, expression.pos);
					yield * erase$2(expression);
					resetIfNewline(codeOf(expression));
					yield coverBetween(`${CD ? ')' : ''}${afterEach}`, expression.end, ts_index);
				}
				else {
					// " ="
					// StringLiteral [ " \"&lt;\"" ]
					const _$value$ = codeOf(initializer);
					const $value$ = trimBefore(_$value$);
					const indexOfBackslash = _$value$.slice(0, -$value$.length).indexOf('/');
					indexOfBackslash<0 || throwPosError(initializer.pos + indexOfBackslash, `there should better not be comments on any side of =`);
					const indexOfQuote = initializer.pos + ( _$value$.length - $value$.length );
					$value$.length>1 && $value$[$value$.length - 1]===$value$[0] || throwPosError(indexOfQuote, `attribute value string literal is not closed`);
					yield coverRange(`${beforeEach}${$name$}:${text2string($value$.slice(1, -1), indexOfQuote + 1)}${afterEach}`, attr);
				}
			}
			else {
				name.end===ts_index || throwPosError(ts_index - 1, `there must be a quoted string or an expression after attribute =`);
				yield coverCode(`${beforeEach}${$name$}:!0${afterEach}`, _name);
			}
		}
		if ( isLast ) {
			properties.end===ts_index || throwUnicode(ts_index/*, properties.end*/, `tag`);
			break;
		}
		isLast = ++index===lastIndex;
	}
}

let ing          = false;
let handle = Generator$1;

const onJSX = ()       => {
	handle = Generator$1;
	ing = true;
};

const onJS$ = (compilerOptions                    )       => {
	on$(compilerOptions);
	handle = Generator;
	ing = true;
};
const onJS = (jsx                  )       => {
	on(jsx);
	handle = Generator;
	ing = true;
};

const off = ()       => {
	off$1();
	ing = false;
};

function * eraseInsertableType (            node                                                                   )                                {
	const expression = node.expression ;
	if ( expression.kind===TypeAssertionExpression ) {
		const { type, expression: value } = expression                      ;
		if ( INCLUDES_EOL(slice(type.pos, RealPos(value))) ) {
			const before_ =
				slice(node.pos, type.pos - 1)// <
			;
			if ( node.kind===YieldExpression ) {
				const _after =
					eraseRange(type)//T
					+
					slice(type.end, value.pos - 1) + ' '// >
					+
					[ ...erase$2(value) ].join('')// v
				;
				const LEFT = before_.length + 1 - before_.trimEnd().length;
				if ( LEFT>=8 ) { yield before_.slice(0, -7) + '{$:0}.$=' + _after; }
				else {
					yield LEFT===1 ? before_ : before_.slice(0, 1 - LEFT);
					const parts = _after.match(WHITESPACES_AND_COMMENT);
					if ( parts ) {
						let left = 8;
						let index = parts.length;
						do {
							if ( CHAR_NOT_EOL(parts[--index] ) ) {
								parts[index] = '{$:0}.$='[--left] ;
								if ( left===LEFT ) { break; }
							}
						}
						while ( index );
						if ( left===8 ) { yield '{$:0}.$=' + _after; }
						else {
							const right = parts.join('');
							yield '{$:0}.$='.slice(0, left) + right + _after.slice(right.length);
						}
					}
					else { yield '{$:0}.$=' + _after; }
				}
			}
			else {
				yield before_;
				if ( before_.endsWith(node.kind===ThrowStatement ? 'throw' : 'return') ) {
					const _type = codeOf(type);
					const real = trimBefore(_type);
					yield '+' + eraseCode(_type.slice(0, -real.length)) + '0' + eraseCode(real.slice(1));
				}
				else { yield '0' + eraseRange(type); }
				yield slice(type.end, value.pos - 1) + ',';
				yield * erase$2(value);
			}
		}
		else {
			yield slice(node.pos, type.pos - 1) + eraseBetween(type.pos - 1, type.end) + slice(type.end, value.pos - 1) + ' ';
			yield * erase$2(value);
		}
	}
	else {
		if ( node.pos!==expression.pos ) { yield slice(node.pos, expression.pos); }
		yield * erase$2(expression);
	}
	if ( expression.end!==node.end ) { yield slice(expression.end, node.end); }
}

function * eraseArgumentType (            node           )                                {
	const children = Children$2(node);
	let index = 0;
	if ( node.kind===NewExpression ) { yield children[index++]          ; }
	yield * erase$2(children[index++]             );
	const { length } = children;
	if ( index===length ) { return; }
	let child = children[index] ;
	if ( typeof child==='object' ) {
		yield * erase$2(child);
		if ( ++index===length ) { return; }
		child = children[index]          ;
	}
	if ( child[child.length - 1]==='<' ) {
		yield child.slice(0, -1) + ' ';
		while ( ++index!==length ) {
			const child = children[index] ;
			if ( typeof child==='string' ) {
				const real = trimBefore(child);
				if ( real && real[0]==='>' ) {
					yield child.slice(0, -real.length) + ' ' + real.slice(1);
					while ( ++index!==length ) {
						const child = children[index] ;
						typeof child==='string'
							? yield child
							: yield * erase$2(child);
					}
					break;
				}
				yield eraseCode(child);
			}
			else { yield eraseRange(child); }
		}
	}
	else {
		yield child;
		while ( ++index!==length ) {
			const child = children[index] ;
			typeof child==='string'
				? yield child
				: yield * erase$2(child);
		}
	}
}

function * eraseFunctionType (            {
	pos: ts_index, end,
	modifiers, asteriskToken, name, questionToken, exclamationToken, typeParameters,
	parameters, type, equalsGreaterThanToken, body,
}                                                                          
	                             
	                             
	                             
	                                          
	                          
	                         
 )                                {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case ReadonlyKeyword:
				case PrivateKeyword:
				case OverrideKeyword:
				case AbstractKeyword:
				case ProtectedKeyword:
				case PublicKeyword:
					yield eraseRange(modifier);
					break;
				case StaticKeyword:
				case AsyncKeyword:
				case ExportKeyword:///
				case ConstKeyword:///
				case DefaultKeyword:///
					yield codeOf(modifier);
					break;
				default:
					throw throwPosError(RealPos(modifier), `@ltd/j-ts does not know modifier ${SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	if ( asteriskToken ) { yield slice(ts_index, ts_index = asteriskToken.end); }
	
	if ( name ) {
		if ( ts_index!==name.pos ) { yield slice(ts_index, name.pos); }
		yield * erase$2(name);
		ts_index = name.end;
	}
	
	if ( questionToken ) { yield slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }///
	if ( exclamationToken ) { yield slice(ts_index, ( ts_index = exclamationToken.end ) - 1) + ' '; }///
	
	let gt = false;
	
	if ( typeParameters ) {
		for ( const typeParameter of typeParameters ) {
			if ( gt ) { yield eraseBetween(ts_index, ts_index = typeParameter.end); }
			else {
				yield slice(ts_index, ts_index = typeParameter.pos - 1) + eraseBetween(ts_index, ts_index = typeParameter.end);
				gt = true;
			}
		}
	}
	
	if ( parameters.length ) {
		for ( const parameter of parameters ) {
			if ( gt ) {
				gt = false;
				yield eraseFirstGT(slice(ts_index, parameter.pos));
			}
			else if ( ts_index!==parameter.pos ) { yield slice(ts_index, parameter.pos); }
			if ( parameter.name.kind===Identifier && parameter.name.escapedText==='this' ) {
				const realAfterChild = trimBefore(slice(ts_index = parameter.end));
				yield eraseBetween(parameter.pos, realAfterChild[0]===',' ? ts_index = 1 - realAfterChild.length : ts_index);
			}
			else {
				yield * erase$2(parameter);
				ts_index = parameter.end;
			}
		}
	}
	
	if ( type ) {
		let beforeColon = slice(ts_index, type.pos - 1);
		if ( gt ) {
			gt = false;
			beforeColon = eraseFirstGT(beforeColon);
		}
		const typing = eraseRange(type);
		let indexAfterD                    ;
		if (
			equalsGreaterThanToken && (
				INCLUDES_EOL(slice(equalsGreaterThanToken.pos, equalsGreaterThanToken.end - 2)) && throwPosError(type.end, `type system seems not treating EOL between "() :Type" and " =>" completely right`)
				||
				INCLUDES_EOL(typing)
				||
				INCLUDES_EOL(beforeColon) && INCLUDES_EOL(beforeColon.slice(indexAfterD = IndexAfterD(beforeColon)))
			)
		) {
			type.end===equalsGreaterThanToken.pos || throwPosError(type.end, `@ltd/j-ts does not know how there could be a part between "() :Type" and " =>"`);
			yield (
				beforeColon.slice(0, indexAfterD ?? ( indexAfterD = IndexAfterD(beforeColon) ))
				+
				'=>'
				+
				( beforeColon.slice(indexAfterD) + ' ' + typing ).replace(FIRST_MAYBE_SECOND_WHITESPACE, '')
				+
				slice(equalsGreaterThanToken.pos, equalsGreaterThanToken.end - 2) + '  '
			);
			ts_index = equalsGreaterThanToken.end;
			equalsGreaterThanToken = undefined$1;
		}
		else {
			yield beforeColon + ' ' + typing;
			ts_index = type.end;
		}
	}
	
	if ( equalsGreaterThanToken ) {
		if ( gt ) {
			gt = false;
			yield eraseFirstGT(slice(ts_index, ts_index = equalsGreaterThanToken.end));
		}
		else { yield slice(ts_index, ts_index = equalsGreaterThanToken.end); }
	}
	
	if ( body ) {
		if ( gt ) {
			gt = false;
			yield eraseFirstGT(slice(ts_index, body.pos));
		}
		else if ( ts_index!==body.pos ) { yield slice(ts_index, body.pos); }
		yield * erase$2(body);
		ts_index = body.end;
	}
	
	if ( ts_index!==end ) {
		yield gt
			? eraseFirstGT(slice(ts_index, end))
			: slice(ts_index, end);
	}
	
}

function * eraseClassType (            {
	pos: ts_index, end,
	modifiers,                name,                                  typeParameters,
	heritageClauses, members,
}  
	                       
	                      
)                                {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case AbstractKeyword:
					yield eraseRange(modifier);
					break;
				case ExportKeyword:///
				case DefaultKeyword:///
				case ConstKeyword:///
					yield codeOf(modifier);
					break;
				default:
					throw throwPosError(RealPos(modifier), `@ltd/j-ts does not know class modifier ${SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	if ( name ) {
		if ( ts_index!==name.pos ) { yield slice(ts_index, name.pos); }
		yield * erase$2(name);
		ts_index = name.end;
	}
	
	let gt = false;
	
	if ( typeParameters ) {
		for ( const typeParameter of typeParameters ) {
			if ( gt ) { yield eraseBetween(ts_index, typeParameter.end); }
			else {
				yield slice(ts_index, typeParameter.pos - 1) + eraseBetween(typeParameter.pos - 1, typeParameter.end);
				gt = true;
			}
			ts_index = typeParameter.end;
		}
	}
	
	if ( heritageClauses ) {
		for ( const { pos, token, types, end } of heritageClauses ) {
			if ( gt ) {
				gt = false;
				yield eraseFirstGT(slice(ts_index, pos));
			}
			else if ( ts_index!==pos ) { yield slice(ts_index, pos); }
			if ( token===ExtendsKeyword ) {
				types.length===1 || throwPosError(types[1] .pos, `"extends" should not have ${types.length} child`);
				const { expression } = types[0] ;
				yield slice(pos, expression.pos);
				yield * erase$2(expression);
				yield eraseBetween(expression.end, end);
			}
			else if ( token===ImplementsKeyword ) {
				const realPos = types[0] .pos - 10;
				yield slice(pos, realPos) + eraseBetween(realPos, end);
			}
			else { throwPosError(pos, `@ltd/j-ts does not know HeritageClause which token is ${SyntaxKind[token]}`); }
			ts_index = end;
		}
	}
	
	for ( const member of members ) {
		if ( gt ) {
			gt = false;
			yield eraseFirstGT(slice(ts_index, member.pos));
		}
		else if ( ts_index!==member.pos ) { yield slice(ts_index, member.pos); }
		member.kind===IndexSignature
			? yield eraseRange(member)
			: yield * erase$2(member);
		// PropertyDeclaration
		// SemicolonClassElement
		// MethodDeclaration
		// ConstructorDeclaration
		// GetAccessorDeclaration
		// SetAccessorDeclaration
		// ClassStaticBlockDeclaration
		ts_index = member.end;
	}
	
	if ( ts_index!==end ) {
		yield gt
			? eraseFirstGT(slice(ts_index, end))
			: slice(ts_index, end);
	}
	
}

function * eraseFieldType (            {
	pos: ts_index, end,
	modifiers, name, questionToken, exclamationToken, type, initializer,
}                          )                                {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case ReadonlyKeyword:
				case PrivateKeyword:
				case OverrideKeyword:
				case ProtectedKeyword:
				case PublicKeyword:
					yield eraseRange(modifier);
					break;
				case StaticKeyword:
					yield codeOf(modifier);
					break;
				case AbstractKeyword:
					throw throwPosError(modifier.end - 8, `@ltd/j-ts expect abstract field with declare`);
				default:
					throw throwPosError(RealPos(modifier), `@ltd/j-ts does not know class field modifier ${SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	{
		if ( ts_index!==name.pos ) { yield slice(ts_index, name.pos); }
		yield * erase$2(name);
		ts_index = name.end;
	}
	
	if ( questionToken ) { yield slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }
	if ( exclamationToken ) { yield slice(ts_index, ( ts_index = exclamationToken.end ) - 1) + ' '; }
	
	if ( type ) { yield slice(ts_index, ts_index = type.pos - 1) + eraseBetween(ts_index, ts_index = type.end); }
	
	if ( initializer ) {
		if ( ts_index!==initializer.pos ) { yield slice(ts_index, initializer.pos); }
		yield * erase$2(initializer);
		ts_index = initializer.end;
	}
	
	if ( ts_index!==end ) { yield slice(ts_index, end); }
	
}

function * eraseVariableType (            {
	pos: ts_index, end,
	modifiers, name, exclamationToken, type, initializer,
}                          )                                {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case ConstKeyword:///
				case ExportKeyword:///
				case DefaultKeyword:///
					yield codeOf(modifier);
					break;
				default:
					throw throwPosError(RealPos(modifier), `@ltd/j-ts does not know modifier ${SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	{
		if ( ts_index!==name.pos ) { yield slice(ts_index, name.pos); }
		yield * erase$2(name);
		ts_index = name.end;
	}
	
	if ( exclamationToken ) { yield slice(ts_index, ( ts_index = exclamationToken.end ) - 1) + ' '; }
	
	if ( type ) { yield slice(ts_index, ts_index = type.pos - 1) + eraseBetween(ts_index, ts_index = type.end); }
	
	if ( initializer ) {
		if ( ts_index!==initializer.pos ) { yield slice(ts_index, initializer.pos); }
		yield * erase$2(initializer);
		ts_index = initializer.end;
	}
	
	if ( ts_index!==end ) { yield slice(ts_index, end); }
	
}

const erase = set_erase(erase$1);
function * erase$1 (            node           )                                {
	switch ( node.kind ) {
		//case NamespaceExportDeclaration:
		case TypeAliasDeclaration:
		case InterfaceDeclaration:
		case ModuleDeclaration:
		//case deps.ProtectedKeyword:
		//case deps.ReadonlyKeyword:
		//case deps.PrivateKeyword:
		//case deps.PublicKeyword:
		//case deps.IndexSignature:
		//case deps.AbstractKeyword:
		case ExclamationToken:///
		//case deps.OverrideKeyword:
			return yield eraseRange(node);
		case EnumDeclaration:
			throw throwPosError(ChildNodeN(node, 0) .pos - 4, `"enum" is not supported while transpileModule`);
		case ImportEqualsDeclaration:
			throw throwPosError(ChildNodeN(node, 1) .pos - 1, `@ltd/j-ts does not support "import="`);
		case ImportDeclaration:
			if ( ( node                           ).importClause?.isTypeOnly ) { return yield eraseRange(node); }
			break;
		case ExportDeclaration:
			if ( ( node                           ).isTypeOnly ) { return yield eraseRange(node); }
			break;
		case ExportAssignment:
			( node                          ).isExportEquals && throwPosError(( node                          ).pos - 1, `@ltd/j-ts does not support "export="`);
			break;
		case Parameter:
			( node                              ).modifiers && throwPosError(RealPos(( node                              ).name), `@ltd/j-ts does not support parameter property (readonly / public / protected / private / override)`);
			break;
	}
	if ( node.modifiers ) { for ( const modifier of node.modifiers ) { if ( modifier.kind===DeclareKeyword ) { return yield eraseRange(node); } } }
	node.decorators && throwPosError(RealPos(node.decorators), `@ltd/j-ts can not handle decorator`);
	switch ( node.kind ) {
		case CallExpression:
		case NewExpression:
		case TaggedTemplateExpression:
			return yield * eraseArgumentType(node);
		case VariableDeclaration:
			return yield * eraseVariableType(node                            );
		case PropertyDeclaration:
			return yield * eraseFieldType(node                            );
		case ArrowFunction:
			return yield * eraseFunctionType(node                      );
		case MethodDeclaration:
		case FunctionDeclaration:
			return ( node                                                      ).body
				? yield * eraseFunctionType(node                                                     )
				: yield eraseRange(node);
		case FunctionExpression:
			return yield * eraseFunctionType(node                           );
		case GetAccessor:
		case SetAccessor:
		case Constructor:
			return ( node                                                                                            ).body
				? yield * eraseFunctionType(node                                                                                           )
				: yield eraseRange(node);
		case ClassDeclaration:
		case ClassExpression:
			return yield * eraseClassType(node                                                );
		case Parameter: {
			const { dotDotDotToken, name, questionToken, type, initializer } = node                             ;
			let ts_index = node.pos;
			if ( dotDotDotToken ) {
				if ( ts_index!==dotDotDotToken.pos ) { yield slice(ts_index, dotDotDotToken.pos); }
				yield * erase$2(dotDotDotToken);
				ts_index = dotDotDotToken.end;
			}
			{
				if ( ts_index!==name.pos ) { yield slice(ts_index, name.pos); }
				yield * erase$2(name);
				ts_index = name.end;
			}
			if ( questionToken ) { yield slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }
			if ( type ) { yield slice(ts_index, type.pos - 1) + eraseBetween(type.pos - 1, ts_index = type.end); }
			if ( initializer ) {
				if ( ts_index!==initializer.pos ) { yield slice(ts_index, initializer.pos); }
				yield * erase$2(initializer);
				ts_index = initializer.end;
			}
			if ( ts_index!==node.end ) { yield slice(ts_index, node.end); }
			return;
		}
		case NonNullExpression: {
			const { expression } = node                          ;
			if ( node.pos!==expression.pos ) { yield slice(node.pos, expression.pos); }
			yield * erase$2(expression);
			yield slice(expression.end, node.end - 1) + ' ';
			return;
		}
		case AsExpression: {
			const { expression, type } = node                     ;
			yield * erase$2(expression);
			yield slice(expression.end, type.pos - 2) + eraseBetween(type.pos - 2, type.end);
			return;
		}
	}
	if ( ing ) {
		const generator = handle(node);
		if ( generator ) { return yield * generator; }
	}
	else {
		switch ( node.kind ) {
			case ReturnStatement:
				return ( node                         ).expression
					? yield * eraseInsertableType(node                        )
					: yield codeOf(node);
			case ThrowStatement:
				return yield * eraseInsertableType(node                       );
			case YieldExpression:
				if ( ( node                         ).expression ) {
					if ( ( node                         ).asteriskToken ) {
						const { expression } = node                        ;
						yield slice(node.pos, expression .pos);
						yield * erase$2(expression );
						if ( expression .end!==node.end ) { yield slice(expression .end, node.end); }
					}
					else { yield * eraseInsertableType(node                        ); }
				}
				else { yield codeOf(node); }
				return;
			case TypeAssertionExpression: {
				const { type, expression } = node                      ;
				yield slice(node.pos, type.pos - 1) + eraseBetween(type.pos - 1, type.end) + slice(type.end, expression.pos - 1) + ' ';
				yield * erase$2(expression);
				return;
			}
		}
	}
	let ts_index = node.pos;
	const childNodes = ChildNodes(node);
	if ( childNodes ) {
		for ( const child of childNodes ) {
			if ( ts_index!==child.pos ) { yield slice(ts_index, child.pos); }
			yield * erase$2(child);
			ts_index = child.end;
		}
	}
	if ( ts_index!==node.end ) { yield slice(ts_index, node.end); }
}

const OutputText = (fileName        , X         )         => [ ...erase(createSourceFile(fileName, ts, ESNext, false, X ? TSX : TS)) ].join('');

const transpileModule = (input        , jsx_transpileOptions                                                  
	                            
		                             
		                                            
		                                  
		                             
		                                     
		                                 
		                                           
		                                      
		                                          
	 
  = false, fileName         )                                                                     => {
	on$1();
	try {
		set_ts(input);
		if ( typeof jsx_transpileOptions==='object' ) {
			const compilerOptions = jsx_transpileOptions?.compilerOptions;
			const sourceMap = compilerOptions?.sourceMap;
			if ( sourceMap!==undefined$1 && sourceMap!==false ) { throw TypeError$1(`transpileModule(,{compilerOptions:{sourceMap:!false}})`); }
			let X         ;
			const jsX = compilerOptions?.jsx                               ;
			switch ( typeof jsX==='string' ? A2a(jsX) : jsX ) {
				case undefined$1:
				case None:
					X = false;
					break;
				case Preserve:
				case ReactNative:
				case 'preserve':
				case 'react-native':
					onJSX();
					X = true;
					break;
				case React:
				case 'react':
					if ( compilerOptions?.jsxImportSource!==undefined$1 ) { throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react',jsxImportSource:!undefined}})`); }
					onJS$(compilerOptions);
					X = true;
					break;
				case ReactJSX:
				case 'react-jsx':
					throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react-jsx'}})`);
				case ReactJSXDev:
				case 'react-jsxdev':
					throw TypeError$1(`transpileModule(,{compilerOptions:{jsx:'react-jsxdev'}})`);
				default:
					throw TypeError$1('transpileModule(,{compilerOptions:{jsx:unknown}})');
			}
			const useDefineForClassFields = compilerOptions?.useDefineForClassFields;
			if ( useDefineForClassFields!==undefined$1 && useDefineForClassFields!==true ) { throw TypeError$1(`transpileModule(,{compilerOptions:{useDefineForClassFields:!true}})`); }
			const downlevelIteration = compilerOptions?.downlevelIteration;
			if ( downlevelIteration!==undefined$1 && downlevelIteration!==false ) { throw TypeError$1(`transpileModule(,{compilerOptions:{downlevelIteration:!false}})`); }
			const experimentalDecorators = compilerOptions?.experimentalDecorators;
			if ( experimentalDecorators!==undefined$1 && experimentalDecorators!==false ) { throw TypeError$1(`transpileModule(,{compilerOptions:{experimentalDecorators:!false}})`); }
			set_filename(fileName);
			const { diagnostics } = TypeScript_transpileModule(ts, jsx_transpileOptions);
			return {
				diagnostics,
				outputText: OutputText(typeof fileName==='string' ? fileName : '', X),
				sourceMapText: undefined$1,
			};
		}
		else {
			if ( typeof jsx_transpileOptions==='function' ) {
				onJS(jsx_transpileOptions);
				jsx_transpileOptions = true;
			}
			else { jsx_transpileOptions && onJSX(); }
			set_filename(fileName);
			return OutputText('', jsx_transpileOptions);
		}
	}
	finally {
		off();
		off$2();
	}
};

const _default = Default(transpileModule, {
	transpileModule,
	version: version$1,
});

module.exports = _default;

//# sourceMappingURL=index.js.map