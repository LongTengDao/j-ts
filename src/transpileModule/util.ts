import Error from '.Error';
import test from '.RegExp.prototype.test';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';
import undefined from '.undefined';

import * as deps from '../deps';
import * as ing from './ing';

export let erase :(this :void, node :Node) => Generator<string, void, void>;
export const set_erase = <T extends (this :void, node :Node) => Generator<string, void, void>> (value :T) :T => erase = value;

export const EOL = /\r\n?|[\n\u2028\u2029]/;
export const INDEX_OF_EOL = /[\n\r\u2028\u2029]/;
export const INCLUDES_EOL = /*#__PURE__*/test.bind(INDEX_OF_EOL);
export const WHITESPACES_AND_COMMENT = /\s|\/(?:\/.*|\*[^]*?\*\/)/gy;
export const CHAR_NOT_EOL = /*#__PURE__*/test.bind(/[^\n\r/\u2028\u2029]/);
export const FIRST_MAYBE_SECOND_WHITESPACE = /^[^\n\r/\u2028\u2029]{1,2}/;
export const TAB_INDENT = /^(?:[\n\r\u2028\u2029]\t*)+/;
export const SPACE_INDENT = /^(?:[\n\r\u2028\u2029] *)+/;

const LEADING_WHITESPACE_OR_COMMENT = /*#__PURE__*/( () => {
	const re = /\s+|\/(?:\/.*|\*[^]*?\*\/)/y;
	re.test = test;
	return re;
} )();
const AT$_$ = /@\S+\s+.*/g;
export function * readAT (this :void) :Generator<string, void, void> {
	let lastIndex = LEADING_WHITESPACE_OR_COMMENT.lastIndex = 0;
	while ( LEADING_WHITESPACE_OR_COMMENT.test(ing.ts) ) {
		if ( ing.ts.startsWith('/*', lastIndex) ) {
			const all = ing.ts.slice(lastIndex + 2, LEADING_WHITESPACE_OR_COMMENT.lastIndex - 2).match(AT$_$);
			if ( all ) {
				for ( const each of all ) { yield each; }
			}
		}
		lastIndex = LEADING_WHITESPACE_OR_COMMENT.lastIndex;
	}
}

export const min = (a :number, b :number) => a<b ? a : b;

export const slice = (start :number, end? :number) => ing.ts.slice(start, end);
export const codeOf = (range :deps.ReadonlyTextRange) => ing.ts.slice(range.pos, range.end);

export const throwPosError = (index :number, message :string) :never => {
	if ( ing.filename!==undefined ) {
		const linesBeforeError = ing.ts.slice(0, index).split(EOL);
		const errorLineNumber = linesBeforeError.length;
		message += `\n    at (${ing.filename}:${errorLineNumber}:${linesBeforeError[errorLineNumber - 1]!.length + 1})`;
	}
	const error :Error & { index? :number } = Error(message);
	error.index = index;
	throw error;
};

const S = /\S/g;
export const eraseCode = (code :string) => code.replace(S, ' ');
export const eraseBetween = (start :number, end :number) => ing.ts.slice(start, end).replace(S, ' ');
export const eraseRange = (range :deps.ReadonlyTextRange) => ing.ts.slice(range.pos, range.end).replace(S, ' ');

const LEADING_WHITESPACES_AND_COMMENT = /^(?:\s+|\/(?:\/.*|\*[^]*?\*\/))+/;
export const trimBefore = (_real :string) => _real.replace(LEADING_WHITESPACES_AND_COMMENT, '');
export const RealPos = ({ pos, end } :deps.ReadonlyTextRange) => end - trimBefore(ing.ts.slice(pos, end)).length;

const COMMENT = /\/(?:\/.*|\*[^]*?\*\/)/g;
export const IndexAfterD = (beforeColon :string) => beforeColon.replace(COMMENT, eraseCode).lastIndexOf(')') + 1;

export const eraseFirstGT = (_gt$ :string) => {
	const gt$ = trimBefore(_gt$);
	return _gt$.slice(0, -gt$.length) + ' ' + gt$.slice(1);
};

export type Node = object & {
	readonly pos :number
	readonly end :number
	readonly kind :number
	readonly decorators?: deps.DecoratorsArray
	readonly modifiers? :deps.ModifiersArray
};
export type ChildNodes<T extends Node = Node> = Like<T>;
export type Children = Like<Node | string>;
interface Like<T> extends ArrayLike<T> { readonly [Symbol.iterator] :(this :this) => IterableIterator<T>; }
let childNodes :ChildNodes | null = null;
let childNodes_writable = false;
const pushNode = (node :Node) :false => {
	if ( childNodes ) {
		if ( childNodes_writable ) { ( childNodes as Node[] )[childNodes.length] = node; }
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
const pushNodes = (nodes :readonly Node[]) :false => {
	if ( childNodes ) {
		if ( childNodes_writable ) { apply(push, childNodes as Node[], nodes); }
		else {
			childNodes = [ ...childNodes, ...nodes ];
			childNodes_writable = true;
		}
	}
	else { childNodes = nodes; }
	return false;
};
export const ChildNodes = (node :Node) :ChildNodes | null => {
	try {
		deps.forEachChild(node as any, pushNode, pushNodes);
		return childNodes;
	}
	finally { childNodes = null; }
};
export const ChildNodeN = (node :Node, n :number) :Node | undefined => deps.forEachChild(node as any, (node :Node) => n ? void --n : node);
const CHILDREN = [] as const;
export const Children = (node :Node) :Children => {
	let ts_index = node.pos;
	const childNodes = ChildNodes(node);
	if ( childNodes ) {
		const children :( Node | string )[] = [];
		let children_length = 0;
		for ( const child of childNodes ) {
			if ( ts_index!==child.pos ) { children[children_length++] = ing.ts.slice(ts_index, child.pos); }
			children[children_length++] = child;
			ts_index = child.end;
		}
		if ( ts_index!==node.end ) { children[children_length] = ing.ts.slice(ts_index, node.end); }
		return children;
	}
	return ts_index===node.end ? CHILDREN : [ ing.ts.slice(ts_index, node.end) ];
};

const search = /[A-Z]+/g;
const replacer = (A2Z :string) => A2Z.toLowerCase();
export const A2a = (string :string) => string.replace(search, replacer);
