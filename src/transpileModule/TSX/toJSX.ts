import * as deps from '../../deps';
import * as ing from '../ing';
import * as util from '../util';

export const throwUnicode = (ts_index :number, who :string) => {
	const _$ = util.slice(ts_index);
	const $ = util.trimBefore(_$);
	for ( const unicode of $ ) {
		util.throwPosError(ts_index + ( _$.length - $.length ), `${who} is interrupted by invalid character "${unicode}"`);
	}
};
export const ensureD$ = (parent :deps.JsxExpression | deps.JsxSpreadAttribute, whose :string) :void => {
	parent.expression!.end!==parent.end && ing.ts[parent.end - 1]==='}' || util.throwPosError(parent.expression!.pos - 1, `${whose} expression is not closed`);
};
export const ensureGT$ = (node :
	| deps.JsxOpeningElement | deps.JsxClosingElement
	| deps.JsxSelfClosingElement
	| deps.JsxOpeningFragment | deps.JsxClosingFragment
) :void => {
	if ( node.pos!==node.end && ing.ts[node.end - 1]==='>' ) { return; }
	const who =
		node.pos===node.end
			? node.kind===deps.JsxClosingElement ? 'element' : 'fragment'
			:
				node.kind===deps.JsxOpeningElement ? 'element opening tag' :
				node.kind===deps.JsxClosingElement ? 'element closing tag' :
				node.kind===deps.JsxSelfClosingElement ? 'self-closing element tag' :
				node.kind===deps.JsxOpeningFragment ? 'fragment opening tag' :
				node.kind===deps.JsxClosingFragment ? 'fragment closing tag' :
			'';
	const rest = util.trimBefore(util.slice(node.end));
	if ( rest ) {
		for ( const unicode of rest ) {
			util.throwPosError(node.pos, `${who} is ${rest ? `not closed` : `interrupted by invalid character "${unicode}"`}`);
		}
	}
	else { util.throwPosError(node.pos, `${who} is not closed`); }
};

export function Generator (this :void, node :util.Node) :Generator<string, void, void> | null {
	switch ( node.kind ) {
		case deps.JsxSelfClosingElement: return SelfClosingElementGenerator(node as deps.JsxSelfClosingElement);
		case deps.JsxElement: return ElementGenerator(node as deps.JsxElement);
		case deps.JsxFragment: return FragmentGenerator(node as deps.JsxFragment);
	}
	return null;
}
function * FragmentGenerator (this :void, node :deps.JsxFragment) :Generator<string, void, void> {
	/* opening */
	ensureGT$(node.openingFragment);
	yield util.codeOf(node.openingFragment);
	/* children */
	if ( node.children.length ) { yield * Children(node); }
	/* closing */
	ensureGT$(node.closingFragment);
	yield util.codeOf(node.closingFragment);
}
function * SelfClosingElementGenerator (this :void, node :deps.JsxSelfClosingElement) :Generator<string, void, void> {
	/* opening */
	yield * Opening(node);
	/* closing */
	ensureGT$(node);
}
function * ElementGenerator (this :void, node :deps.JsxElement) :Generator<string, void, void> {
	/* opening */
	yield * Opening(node.openingElement);
	/* children */
	if ( node.children.length ) { yield * Children(node); }
	/* closing */
	ensureGT$(node.closingElement);
	yield util.codeOf(node.closingElement);
}

export function * Opening (this :void, node :deps.JsxSelfClosingElement | deps.JsxOpeningElement) :Generator<string, void, void> {
	const { tagName, typeArguments, attributes } = node;
	/* type */
	yield util.slice(node.pos, tagName.end);
	if ( typeArguments ) { yield util.slice(tagName.end, typeArguments.pos - 1) + util.eraseBetween(typeArguments.pos - 1, attributes.pos); }
	/* attributes */
	attributes.properties.length
		? yield * Attributes(attributes)
		: attributes.pos===attributes.end || throwUnicode(attributes.pos/*, attributes.end*/, `tag`);
	ensureGT$(node as deps.JsxSelfClosingElement | deps.JsxOpeningElement);
	yield util.slice(attributes.end, node.end);
}

export function * Children (this :void, { children } :deps.JsxElement | deps.JsxFragment) :Generator<string, void, void> {
	const { length } = children;
	let index = 0;
	do {
		const child = children[index]!;
		switch ( child.kind ) {
			case deps.JsxText:
				yield util.codeOf(child);
				break;
			case deps.JsxExpression:
				const { expression } = child;
				if ( expression ) {
					ensureD$(child, `child`);
					yield util.slice(child.pos, expression.pos);
					yield * util.erase(expression);
					yield util.slice(expression.end, child.end);
				}
				else { yield util.codeOf(child); }
				break;
			case deps.JsxElement:
				yield * ElementGenerator(child as deps.JsxElement);
				break;
			case deps.JsxSelfClosingElement:
				yield * Opening(child as deps.JsxSelfClosingElement);
				break;
			case deps.JsxFragment:
				yield * FragmentGenerator(child as deps.JsxFragment);
				break;
			default:
				throw util.throwPosError(( child as util.Node ).pos, `@ltd/j-ts does not know about child kind ${deps.SyntaxKind[( child as util.Node ).kind]}`);
		}
	}
	while ( ++index!==length );
}

function * Attributes (this :void, { properties } :deps.JsxAttributes) :Generator<string, void, void> {
	let ts_index = properties.pos;
	const lastIndex = properties.length - 1;
	let index = 0;
	let isLast = !lastIndex;
	for ( ; ; ) {
		const attr = properties[index]!;
		attr.pos===ts_index || throwUnicode(ts_index/*, attr.pos*/, `tag`);
		ts_index = attr.end;
		if ( attr.kind===deps.JsxSpreadAttribute ) {
			const { expression } = attr;
			ensureD$(attr, `JsxSpreadAttribute`);
			yield util.slice(attr.pos, expression.pos);
			yield * util.erase(expression);
			yield util.slice(expression.end, ts_index);
		}
		else if ( attr.kind===deps.JsxAttribute ) {
			const { initializer } = attr;
			if ( initializer ) {
				if ( initializer.kind===deps.JsxExpression ) {
					ensureD$(initializer, `attribute value`);
					const { expression } = initializer;
					if ( expression ) {
						yield util.slice(properties.pos, expression.pos);
						yield * util.erase(expression);
						yield util.slice(expression.end, properties.end);
					}
					else { yield util.codeOf(attr); }
				}
				else {
					const _$value$ = util.codeOf(initializer);
					const $value$ = util.trimBefore(_$value$);
					const indexOfQuote = initializer.pos + ( _$value$.length - $value$.length );
					$value$.length>1 && $value$[$value$.length - 1]===$value$[0] || util.throwPosError(indexOfQuote, `attribute value string literal is not closed`);
					yield util.codeOf(attr);
				}
			}
			else {
				!attr.name || attr.name.end===properties.end || util.throwPosError(properties.end - 1, `there must be a quoted string or an expression after attribute =`);
				yield util.codeOf(attr);
			}
		}
		else { util.throwPosError(util.RealPos(attr as util.Node), `${deps.SyntaxKind[( attr as util.Node ).kind]}`); }
		if ( isLast ) {
			properties.end===ts_index || throwUnicode(ts_index/*, properties.end*/, `tag`);
			break;
		}
		isLast = ++index===lastIndex;
	}
}
