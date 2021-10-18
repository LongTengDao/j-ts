import * as deps from '../../deps';
import * as util from '../util';

export default function * (this :void, node :deps.ReturnStatement | deps.ThrowStatement | deps.YieldExpression) :Generator<string, void, void> {
	const expression = node.expression!;
	if ( expression.kind===deps.TypeAssertionExpression ) {
		const { type, expression: value } = expression as deps.TypeAssertion;
		if ( util.INCLUDES_EOL(util.slice(type.pos, util.RealPos(value))) ) {
			const before_ =
				util.slice(node.pos, type.pos - 1)// <
			;
			if ( node.kind===deps.YieldExpression ) {
				const _after =
					util.eraseRange(type)//T
					+
					util.slice(type.end, value.pos - 1) + ' '// >
					+
					[ ...util.erase(value) ].join('')// v
				;
				const LEFT = before_.length + 1 - before_.trimEnd().length;
				if ( LEFT>=8 ) { yield before_.slice(0, -7) + '{$:0}.$=' + _after; }
				else {
					yield LEFT===1 ? before_ : before_.slice(0, 1 - LEFT);
					const parts = _after.match(util.WHITESPACES_AND_COMMENT);
					if ( parts ) {
						let left = 8;
						let index = parts.length;
						do {
							if ( util.CHAR_NOT_EOL(parts[--index]!) ) {
								parts[index] = '{$:0}.$='[--left]!;
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
				if ( before_.endsWith(node.kind===deps.ThrowStatement ? 'throw' : 'return') ) {
					const _type = util.codeOf(type);
					const real = util.trimBefore(_type);
					yield '+' + util.eraseCode(_type.slice(0, -real.length)) + '0' + util.eraseCode(real.slice(1));
				}
				else { yield '0' + util.eraseRange(type); }
				yield util.slice(type.end, value.pos - 1) + ',';
				yield * util.erase(value);
			}
		}
		else {
			yield util.slice(node.pos, type.pos - 1) + util.eraseBetween(type.pos - 1, type.end) + util.slice(type.end, value.pos - 1) + ' ';
			yield * util.erase(value);
		}
	}
	else {
		if ( node.pos!==expression.pos ) { yield util.slice(node.pos, expression.pos); }
		yield * util.erase(expression);
	}
	if ( expression.end!==node.end ) { yield util.slice(expression.end, node.end); }
}
