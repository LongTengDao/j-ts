import * as deps from '../../deps';
import * as util from '../util';

export default function * (this :void, node :util.Node) :Generator<string, void, void> {
	const children = util.Children(node);
	let index = 0;
	if ( node.kind===deps.NewExpression ) { yield children[index++] as string; }
	yield * util.erase(children[index++] as util.Node);
	const { length } = children;
	if ( index===length ) { return; }
	let child = children[index]!;
	if ( typeof child==='object' ) {
		yield * util.erase(child);
		if ( ++index===length ) { return; }
		child = children[index] as string;
	}
	if ( child[child.length - 1]==='<' ) {
		yield child.slice(0, -1) + ' ';
		while ( ++index!==length ) {
			const child = children[index]!;
			if ( typeof child==='string' ) {
				const real = util.trimBefore(child);
				if ( real && real[0]==='>' ) {
					yield child.slice(0, -real.length) + ' ' + real.slice(1);
					while ( ++index!==length ) {
						const child = children[index]!;
						typeof child==='string'
							? yield child
							: yield * util.erase(child);
					}
					break;
				}
				yield util.eraseCode(child);
			}
			else { yield util.eraseRange(child); }
		}
	}
	else {
		yield child;
		while ( ++index!==length ) {
			const child = children[index]!;
			typeof child==='string'
				? yield child
				: yield * util.erase(child);
		}
	}
}
