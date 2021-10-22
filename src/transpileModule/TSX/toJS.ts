import Error from '.Error';
import TypeError from '.TypeError';
import test from '.RegExp.prototype.test';
import exec from '.RegExp.prototype.exec';
import undefined from '.undefined';

import { StringLiteral, isIdentifierName, isIdentifier } from '@ltd/j-es';

import * as deps from '../../deps';
import * as ing from '../ing';
import * as util from '../util';
import { ensureD$, ensureGT$, throwUnicode } from './toJSX';

let credit :number = 0;
let jsxFactory :string | undefined;
let jsxFragmentFactory :string | undefined;

const AMP_OR_BACKSLASH = /[&\\]/;
const text2string = (value :string, ts_index :number) :string => {
	const indexOfAMP = value.search(AMP_OR_BACKSLASH);
	return indexOfAMP<0 ? StringLiteral(value) : util.throwPosError(ts_index + indexOfAMP, ``);
};
const needCD = (expression :deps.Expression) => expression.kind===deps.BinaryExpression && ( expression as deps.BinaryExpression ).operatorToken.kind===deps.CommaToken;
const notMin = /*#__PURE__*/test.bind(/[\s/]/);
const couldNotNotString = /*#__PURE__*/test.bind(/[-:]/);
const NO_ATTRIBUTE = /*#__PURE__*/test.bind(/^{\s*}\s*$/);

const coverCode = (dist :string, src :string) :string => {
	const index = src.search(util.INDEX_OF_EOL);
	if ( index<0 ) {
		const surplus = src.length - dist.length;
		if ( surplus>credit ) {
			dist += util.eraseCode(src.slice(dist.length + credit));
			credit = 0;
		}
		else { credit -= surplus; }
	}
	else {
		dist += util.eraseCode(src.slice(util.min(index, dist.length)));
		credit = 0;
	}
	return dist;
};
const coverBetween = (dist :string, srcStart :number, srcEnd :number) :string => coverCode(dist, ing.ts.slice(srcStart, srcEnd));
const coverRange = (dist :string, srcRange :deps.ReadonlyTextRange) :string => coverCode(dist, ing.ts.slice(srcRange.pos, srcRange.end));
const resetIfNewline = (code :string) => {
	if ( credit && util.INCLUDES_EOL(code) ) { credit = 0; }
};

let $jsx :string | undefined;
let $jsxFrag :string | undefined;
const jsx$_$ = /*#__PURE__*/exec.bind(/^jsx(?:Frag)?\s+(\S*)/);
const Along = (along :string) :string => {
	const parts = along.split('.');
	if ( !isIdentifier(parts[0]!) ) { return ''; }
	let index = parts.length;
	while ( --index ) {
		if ( !isIdentifierName(parts[index]!) ) { return ''; }
	}
	return along;
};
const readJSX = () => {
	for ( const at of util.readAT() ) {
		const _$ = jsx$_$(at.slice(1));
		if ( _$ ) {
			if ( at[4]==='F' ) {
				if ( $jsxFrag===undefined ) {
					$jsxFrag = Along(_$[1]!);
					if ( $jsx!==undefined ) { break; }
				}
			}
			else {
				if ( $jsx===undefined ) {
					$jsx = Along(_$[1]!);
					if ( $jsxFrag!==undefined ) { break; }
				}
			}
		}
	}
};

const noReasonNotString = /*#__PURE__*/test.bind(/^[a-z][^.]*$/);
const GENERATE_START :GenerateStart = (value, { index, type }) =>
	value
		? value==='this'
			? util.throwPosError(index - 1, `tag name should better not be "this", because it should be an intrinsic element according to the current react jsx spec/docs, but is a value-based element in typescript and babel in fact for historical reason, so please use it more exactly via a variable`)
			: noReasonNotString(value) || couldNotNotString(value)
				? type ? util.throwPosError(index - 1, `intrinsic element cannot has type arguments`) : `${jsxFactory}('${value}',`
				: `${jsxFactory}(${value},`
		: `${jsxFactory}(${jsxFragmentFactory!},null,`;
let generateStart :GenerateStart = GENERATE_START;

export const off = () :void => {
	$jsx = $jsxFrag = jsxFactory = jsxFragmentFactory = undefined;
	generateStart = GENERATE_START;
};
export type GenerateStart = (this :void, name :string, {} :{
	index :number
	path :string | undefined
	code :string
	type :boolean
}) => `${string}(${string},` | `${string}(`;
export const on = (jsx :GenerateStart) :void => {
	readJSX();
	generateStart = jsx;
};
export type CompilerOptions = {
	readonly jsxFactory? :string,
	readonly jsxFragmentFactory? :string,
	readonly reactNamespace? :string,
} | undefined;
export const on$ = (compilerOptions :CompilerOptions) :void => {
	readJSX();
	let reactNamespace :string | undefined;
	if ( $jsx ) { jsxFactory = $jsx; }
	else {
		jsxFactory = compilerOptions?.jsxFactory;
		if ( jsxFactory===undefined ) {
			reactNamespace = compilerOptions?.reactNamespace;
			if ( reactNamespace===undefined ) { reactNamespace = 'React'; }
			else if ( typeof reactNamespace!=='string' ) { throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react',reactNamespace:!string}})`); }
			jsxFactory = reactNamespace + '.createElement';
		}
		else if ( typeof jsxFactory!=='string' ) { throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react',jsxFactory:!string}})`); }
	}
	if ( $jsxFrag ) { jsxFragmentFactory = $jsxFrag; }
	else {
		jsxFragmentFactory = compilerOptions?.jsxFragmentFactory;
		if ( jsxFragmentFactory===undefined ) {
			if ( reactNamespace===undefined ) {
				reactNamespace = compilerOptions?.reactNamespace;
				if ( reactNamespace===undefined ) { reactNamespace = 'React'; }
				else if ( typeof reactNamespace!=='string' ) { throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react',reactNamespace:!string}})`); }
			}
			jsxFragmentFactory = reactNamespace + '.Fragment';
		}
		else if ( typeof jsxFragmentFactory!=='string' ) { throw TypeError(`transpileModule(,{compilerOptions:{jsx:'react',jsxFragmentFactory:!string}})`); }
	}
	generateStart = GENERATE_START;
};

export function Generator (this :void, node :util.Node) :Generator<string, void, void> | null {
	switch ( node.kind ) {
		case deps.JsxSelfClosingElement: return SelfClosingElementGenerator(node as deps.JsxSelfClosingElement, true);
		case deps.JsxElement: return ElementGenerator(node as deps.JsxElement, true);
		case deps.JsxFragment: return FragmentGenerator(node as deps.JsxFragment, true);
	}
	return null;
}

function * FragmentGenerator (this :void, node :deps.JsxFragment, reset :boolean) :Generator<string, void, void> {
	// openingFragment: JsxOpeningFragment [ " < >" ]
	// children: ... JsxText | JsxExpression | Jsx3
	// closingFragment: JsxClosingFragment [ "</ >" ]
	if ( reset ) { credit = 0; }
	/* opening */
	ensureGT$(node.openingFragment);
	const _real = util.codeOf(node.openingFragment);
	const real = util.trimBefore(_real);
	yield coverCode(``, _real.slice(0, -real.length));
	const index = node.openingFragment.end - real.length;
	const start = generateStart('', {
		index,
		path: ing.filename,
		code: ing.ts,
		type: false,
	});
	if ( typeof start!=='string' ) { throw TypeError(`transpileModule(,jsx) must return a string`); }
	let needComma = true;
	switch ( start[start.length - 1] ) {
		case ',': break;
		case '(': needComma = false; break;
		default: throw TypeError(`transpileModule(,jsx) must return string endsWith "," or "("`);
	}
	if ( util.INCLUDES_EOL(start) ) { throw Error(`transpileModule(,jsx) must return single line string`); }
	yield coverCode(needComma ? start.slice(0, -1) : start, real);
	/* children */
	if ( node.children.length ) { yield * Children(needComma ? ',' : '', node); }
	/* closing */
	ensureGT$(node.closingFragment);
	yield coverRange(`)`, node.closingFragment);
	if ( reset ) { credit = 0; }
}
function * SelfClosingElementGenerator (this :void, node :deps.JsxSelfClosingElement, reset :boolean) :Generator<string, void, void> {
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
function * ElementGenerator (this :void, node :deps.JsxElement, reset :boolean) :Generator<string, void, void> {
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
	ing.ts.startsWith(`</${tag_min}>`, node.closingElement.pos) || util.throwPosError(node.closingElement.pos, `the closing tag should better have verbatim same name with opening tag, and without any whitespace or comment in`);
	yield coverRange(`)`, node.closingElement);
	if ( reset ) { credit = 0; }
}

function * Opening (this :void, node :deps.JsxSelfClosingElement | deps.JsxOpeningElement, after :`)` | ``) :Generator<string, string, void> {
	// " <"
	// ThisKeyword | Identifier | PropertyAccessExpression
	// " <"?
	// $?
	// " >"?
	// JsxAttributes
	// " / >" | " >"
	const { tagName, attributes } = node;
	yield coverBetween('', node.pos, tagName.pos - 1);
	const tag_min = util.codeOf(tagName);
	notMin(tag_min) && util.throwPosError(tagName.pos - 1, `whitespaces and comments should better not appear in tag name`);
	const indexOfBackslash = tag_min.indexOf('\\');
	indexOfBackslash<0 || util.throwPosError(tagName.pos + indexOfBackslash, `tag name should better not contain UnicodeEscapeSequence`);
	node.typeArguments && tagName.end + 1!==node.typeArguments.pos && util.throwPosError(tagName.pos - 1, `whitespaces and comments should better not appear between tag name and type argument`);
	const start = generateStart(tag_min, {
		index: tagName.pos,
		path: ing.filename,
		code: ing.ts,
		type: ing.ts[tagName.end]==='<',
	});
	if ( typeof start!=='string' ) { throw TypeError(`transpileModule(,jsx) must return a string`); }
	switch ( start[start.length - 1] ) {
		case ',': break;
		case '(': break;
		default: throw TypeError(`transpileModule(,jsx) must return string endsWith "," or "("`);
	}
	if ( util.INCLUDES_EOL(start) ) { throw Error(`transpileModule(,jsx) must return single line string`); }
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

function * Children (this :void, before :'' | ',', { children } :deps.JsxElement | deps.JsxFragment) :Generator<string, void, void> {
	const lastIndex = children.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( let TEXT = ''; ; before = ',' ) {
		const child = children[index]!;
		switch ( child.kind ) {
			case deps.JsxText:
				// === JsxText:
				// " &lt; "
				const text = util.codeOf(child);
				const rest = text.replace(text.includes('\t') ? util.TAB_INDENT : util.SPACE_INDENT, '');
				if ( rest ) {
					throw util.throwPosError(child.end - rest.length, `there should better not be JsxText except indents`);
				}
				TEXT += text;
				break;
			case deps.JsxExpression:
				// === JsxExpression:
				// "{" $ " }" | "{ }"
				const { expression } = child;
				if ( expression ) {
					child.dotDotDotToken && util.throwPosError(child.dotDotDotToken.end - 3, `child expression can not start with "..."`);
					ensureD$(child, `child`);
					const CD = needCD(expression);
					yield coverCode(`${before}${CD ? '(' : ''}`, `${TEXT} `);
					yield * util.erase(expression);
					resetIfNewline(util.codeOf(expression));
					yield coverBetween(CD ? ')' : '', expression.end, child.end);
				}
				else { yield coverCode('', TEXT + util.codeOf(child)); }
				TEXT = '';
				break;
			case deps.JsxElement:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * ElementGenerator(child as deps.JsxElement, false);
				break;
			case deps.JsxSelfClosingElement:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * SelfClosingElementGenerator(child as deps.JsxSelfClosingElement, false);
				break;
			case deps.JsxFragment:
				if ( TEXT ) {
					yield coverCode('', TEXT);
					TEXT = '';
				}
				yield * FragmentGenerator(child as deps.JsxFragment, false);
				break;
			default:
				throw util.throwPosError(( child as util.Node ).pos, `@ltd/j-ts does not know about child kind ${deps.SyntaxKind[( child as util.Node ).kind]}`);
		}
		if ( isLast ) {
			if ( TEXT ) { yield coverCode('', TEXT); }
			break;
		}
		isLast = ++index===lastIndex;
	}
}

function * Attributes (this :void, { properties } :deps.JsxAttributes) :Generator<string, void, void> {
	let ts_index = properties.pos;
	const lastIndex = properties.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( let beforeEach :',' | '{' = '{'; ; beforeEach = ',' ) {
		const afterEach = isLast ? '}' : '';
		const attr = properties[index]!;
		attr.pos===ts_index || throwUnicode(ts_index/*, attr.pos*/, `tag`);
		ts_index = attr.end;
		if ( attr.kind===deps.JsxSpreadAttribute ) {
			// === JsxSpreadAttribute:
			// " { ..."
			// $
			// " }"
			const { expression } = attr;
			ing.ts.endsWith('...', expression.pos - 3) || util.throwPosError(expression.pos, `JsxSpreadAttribute must start with "..."`);
			ensureD$(attr, `JsxSpreadAttribute`);
			expression.pos===expression.end && util.throwPosError(expression.pos, `JsxSpreadAttribute can not be empty`);
			if ( expression.kind===deps.ObjectLiteralExpression ) {
				// === " { _ , _ , }"
				// " {"
				// ... `${ _} ,${ _} ,`
				// " }"
				const { properties } = expression as deps.ObjectLiteralExpression;
				const { length } = properties;
				if ( length ) {
					for ( const property of properties ) {
						switch ( property.kind ) {
							case deps.ShorthandPropertyAssignment:
							case deps.SpreadAssignment:
							case deps.MethodDeclaration:
								break;
							case deps.PropertyAssignment:
								switch ( property.name.kind ) {
									case deps.ComputedPropertyName:
										break;
									case deps.StringLiteral:
										property.name.text==='__proto__' && util.throwPosError(util.RealPos(property.name), `@ltd/j-ts does not know what to do for "'__proto__':" while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
										break;
									case deps.Identifier:
										property.name.escapedText==='___proto__' && util.throwPosError(util.RealPos(property.name), `"@ltd/j-ts does not know what to do for "__proto__:" while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
										break;
									default:
										throw util.throwPosError(util.RealPos(property.name), `@ltd/j-ts does not know ${deps.SyntaxKind[property.name.kind]} PropertyAssignment while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
								}
								break;
							case deps.GetAccessor:
							case deps.SetAccessor:
								break;
							default:
								throw util.throwPosError(util.RealPos(property), `@ltd/j-ts does not know ${deps.SyntaxKind[( property as util.Node ).kind]} while trying to optimize ObjectLiteralExpression JsxSpreadAttribute`);
						}
					}
					let property = properties[0]!;
					const firstPropertyPOS = property.pos;
					yield coverBetween(beforeEach, attr.pos, firstPropertyPOS);
					for ( let index = 0; ; ) {
						yield * util.erase(property);
						if ( ++index===length ) { break; }
						yield util.slice(property.end, ( property = properties[index]! ).pos);
					}
					resetIfNewline(util.slice(firstPropertyPOS, property.end));
					yield coverBetween(afterEach, property.end, ts_index);
				}
				else { yield coverBetween(`${beforeEach}${afterEach}`.replace(',', ''), attr.pos, ts_index); }
			}
			else {
				needCD(expression) && util.throwPosError(( expression as deps.BinaryExpression ).operatorToken.end - 1, `invalid "," in JsxSpreadAttribute expression`);
				yield coverBetween(beforeEach, attr.pos, expression.pos - 3) + '...';
				yield * util.erase(expression);
				resetIfNewline(util.codeOf(expression));
				yield coverBetween(afterEach, expression.end, ts_index);
			}
		}
		else {
			// === JsxAttribute:
			// Identifier [ " $" ]
			const { name, initializer } = attr;
			name || util.throwPosError(attr.pos, `attribute name can not be empty`);
			const _name = util.codeOf(name);
			const real = util.trimBefore(_name);
			const _ = _name.slice(0, -real.length) || util.throwPosError(name.pos, `there should better be at least one whitespace before attribute name`);
			_[0]==='/' && util.throwPosError(name.pos, `comments in tag should better be surrounded by at least one whitespace on each side`);
			_[_.length - 1]==='/' && util.throwPosError(name.pos + _.length, `comments in tag should better be surrounded by at least one whitespace on each side`);
			const indexOfBackslash = real.indexOf('\\');
			indexOfBackslash<0 || util.throwPosError(name.pos + _.length + indexOfBackslash, `attribute name should better not contain UnicodeEscapeSequence`);/// or at least throw invalid (syntax, range, __proto__, '')
			real==='__proto__' && util.throwPosError(name.pos + _.length, `attribute name should better not be "__proto__", because it should be a normal property, but is a magic name in fact and not be handled by other transpiler like typescript and babel`);
			const $name$ = couldNotNotString(real) ? `'${real}'`: real;
			if ( initializer ) {
				const indexOfBackslash = util.slice(name.end, initializer.pos).indexOf('/');
				indexOfBackslash<0 || util.throwPosError(name.end + indexOfBackslash, `there should better not be comments on any side of =`);
				if ( initializer.kind===deps.JsxExpression ) {
					// " ="
					// JsxExpression [ " {" $ " }" ]
					initializer.dotDotDotToken && util.throwPosError(initializer.dotDotDotToken.end - 3, `attribute value expression can not start with "..."`);
					const expression = initializer.expression || util.throwPosError(initializer.end - 1, `attribute value expression can not be empty`);
					const indexOfBackslash = util.slice(initializer.pos, expression.pos - 1).indexOf('/');
					indexOfBackslash<0 || util.throwPosError(initializer.pos + indexOfBackslash, `there should better not be comments on any side of =`);
					ensureD$(initializer, `attribute value`);
					const CD = needCD(expression);
					yield coverBetween(`${beforeEach}${$name$}:${CD ? '(' : ''}`, attr.pos, expression.pos);
					yield * util.erase(expression);
					resetIfNewline(util.codeOf(expression));
					yield coverBetween(`${CD ? ')' : ''}${afterEach}`, expression.end, ts_index);
				}
				else {
					// " ="
					// StringLiteral [ " \"&lt;\"" ]
					const _$value$ = util.codeOf(initializer);
					const $value$ = util.trimBefore(_$value$);
					const indexOfBackslash = _$value$.slice(0, -$value$.length).indexOf('/');
					indexOfBackslash<0 || util.throwPosError(initializer.pos + indexOfBackslash, `there should better not be comments on any side of =`);
					const indexOfQuote = initializer.pos + ( _$value$.length - $value$.length );
					$value$.length>1 && $value$[$value$.length - 1]===$value$[0] || util.throwPosError(indexOfQuote, `attribute value string literal is not closed`);
					yield coverRange(`${beforeEach}${$name$}:${text2string($value$.slice(1, -1), indexOfQuote + 1)}${afterEach}`, attr);
				}
			}
			else {
				name.end===ts_index || util.throwPosError(ts_index - 1, `there must be a quoted string or an expression after attribute =`);
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
