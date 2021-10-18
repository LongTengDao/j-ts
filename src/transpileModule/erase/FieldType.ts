import * as deps from '../../deps';
import * as util from '../util';

export default function * (this :void, {
	pos: ts_index, end,
	modifiers, name, questionToken, exclamationToken, type, initializer,
} :deps.PropertyDeclaration) :Generator<string, void, void> {
	
	if ( modifiers ) {
		for ( const modifier of modifiers ) {
			if ( ts_index!==modifier.pos ) { yield util.slice(ts_index, modifier.pos); }
			switch ( modifier.kind ) {
				case deps.ReadonlyKeyword:
				case deps.PrivateKeyword:
				case deps.OverrideKeyword:
				case deps.ProtectedKeyword:
				case deps.PublicKeyword:
					yield util.eraseRange(modifier);
					break;
				case deps.StaticKeyword:
					yield util.codeOf(modifier);
					break;
				case deps.AbstractKeyword:
					throw util.throwPosError(modifier.end - 8, `@ltd/j-ts expect abstract field with declare`);
				default:
					throw util.throwPosError(util.RealPos(modifier), `@ltd/j-ts does not know class field modifier ${deps.SyntaxKind[modifier.kind]}`);
			}
			ts_index = modifier.end;
		}
	}
	
	{
		if ( ts_index!==name.pos ) { yield util.slice(ts_index, name.pos); }
		yield * util.erase(name);
		ts_index = name.end;
	}
	
	if ( questionToken ) { yield util.slice(ts_index, ( ts_index = questionToken.end ) - 1) + ' '; }
	if ( exclamationToken ) { yield util.slice(ts_index, ( ts_index = exclamationToken.end ) - 1) + ' '; }
	
	if ( type ) { yield util.slice(ts_index, ts_index = type.pos - 1) + util.eraseBetween(ts_index, ts_index = type.end); }
	
	if ( initializer ) {
		if ( ts_index!==initializer.pos ) { yield util.slice(ts_index, initializer.pos); }
		yield * util.erase(initializer);
		ts_index = initializer.end;
	}
	
	if ( ts_index!==end ) { yield util.slice(ts_index, end); }
	
}
