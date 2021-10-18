import undefined from '.undefined';

import * as deps from '../../deps';
import * as util from '../util';

export default function * (this :void, {
	pos: ts_index, end,
	modifiers, asteriskToken, name, questionToken, exclamationToken, typeParameters,
	parameters, type, equalsGreaterThanToken, body,
} :deps.ArrowFunction | { readonly equalsGreaterThanToken? :undefined } & (
	| deps.GetAccessorDeclaration
	| deps.SetAccessorDeclaration
	| deps.ConstructorDeclaration
	| deps.MethodDeclaration///MethodSignature
	| deps.FunctionDeclaration
	| deps.FunctionExpression
)) :Generator<string, void, void> {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield util.slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case deps.ReadonlyKeyword:
				case deps.PrivateKeyword:
				case deps.OverrideKeyword:
				case deps.AbstractKeyword:
				case deps.ProtectedKeyword:
				case deps.PublicKeyword:
					yield util.eraseRange(modifier);
					break;
				case deps.StaticKeyword:
				case deps.AsyncKeyword:
				case deps.ExportKeyword:///
				case deps.ConstKeyword:///
				case deps.DefaultKeyword:///
					yield util.codeOf(modifier);
					break;
				default:
					throw util.throwPosError(util.RealPos(modifier), `@ltd/j-ts does not know modifier ${deps.SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	if ( asteriskToken ) { yield util.slice(ts_index, ts_index = asteriskToken.end); }
	
	if ( name ) {
		if ( ts_index!==name.pos ) { yield util.slice(ts_index, name.pos); }
		yield * util.erase(name);
		ts_index = name.end;
	}
	
	if ( questionToken ) { yield util.slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }///
	if ( exclamationToken ) { yield util.slice(ts_index, ( ts_index = exclamationToken.end ) - 1) + ' '; }///
	
	let gt = false;
	
	if ( typeParameters ) {
		for ( const typeParameter of typeParameters ) {
			if ( gt ) { yield util.eraseBetween(ts_index, ts_index = typeParameter.end); }
			else {
				yield util.slice(ts_index, ts_index = typeParameter.pos - 1) + util.eraseBetween(ts_index, ts_index = typeParameter.end);
				gt = true;
			}
		}
	}
	
	if ( parameters.length ) {
		for ( const parameter of parameters ) {
			if ( gt ) {
				gt = false;
				yield util.eraseFirstGT(util.slice(ts_index, parameter.pos));
			}
			else if ( ts_index!==parameter.pos ) { yield util.slice(ts_index, parameter.pos); }
			if ( parameter.name.kind===deps.Identifier && parameter.name.escapedText==='this' ) {
				const realAfterChild = util.trimBefore(util.slice(ts_index = parameter.end));
				yield util.eraseBetween(parameter.pos, realAfterChild[0]===',' ? ts_index = 1 - realAfterChild.length : ts_index);
			}
			else {
				yield * util.erase(parameter);
				ts_index = parameter.end;
			}
		}
	}
	
	if ( type ) {
		let beforeColon = util.slice(ts_index, type.pos - 1);
		if ( gt ) {
			gt = false;
			beforeColon = util.eraseFirstGT(beforeColon);
		}
		const typing = util.eraseRange(type);
		let indexAfterD :number | undefined;
		if (
			equalsGreaterThanToken && (
				util.INCLUDES_EOL(util.slice(equalsGreaterThanToken.pos, equalsGreaterThanToken.end - 2)) && util.throwPosError(type.end, `type system seems not treating EOL between "() :Type" and " =>" completely right`)
				||
				util.INCLUDES_EOL(typing)
				||
				util.INCLUDES_EOL(beforeColon) && util.INCLUDES_EOL(beforeColon.slice(indexAfterD = util.IndexAfterD(beforeColon)))
			)
		) {
			type.end===equalsGreaterThanToken.pos || util.throwPosError(type.end, `@ltd/j-ts does not know how there could be a part between "() :Type" and " =>"`);
			yield (
				beforeColon.slice(0, indexAfterD ?? ( indexAfterD = util.IndexAfterD(beforeColon) ))
				+
				'=>'
				+
				( beforeColon.slice(indexAfterD) + ' ' + typing ).replace(util.FIRST_MAYBE_SECOND_WHITESPACE, '')
				+
				util.slice(equalsGreaterThanToken.pos, equalsGreaterThanToken.end - 2) + '  '
			);
			ts_index = equalsGreaterThanToken.end;
			equalsGreaterThanToken = undefined;
		}
		else {
			yield beforeColon + ' ' + typing;
			ts_index = type.end;
		}
	}
	
	if ( equalsGreaterThanToken ) {
		if ( gt ) {
			gt = false;
			yield util.eraseFirstGT(util.slice(ts_index, ts_index = equalsGreaterThanToken.end));
		}
		else { yield util.slice(ts_index, ts_index = equalsGreaterThanToken.end); }
	}
	
	if ( body ) {
		if ( gt ) {
			gt = false;
			yield util.eraseFirstGT(util.slice(ts_index, body.pos));
		}
		else if ( ts_index!==body.pos ) { yield util.slice(ts_index, body.pos); }
		yield * util.erase(body);
		ts_index = body.end;
	}
	
	if ( ts_index!==end ) {
		yield gt
			? util.eraseFirstGT(util.slice(ts_index, end))
			: util.slice(ts_index, end);
	}
	
}
