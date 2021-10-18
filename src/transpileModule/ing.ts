import Error from '.Error';
import TypeError from '.TypeError';
import undefined from '.undefined';

let ing :boolean = false;

export const on = () :void => {
	if ( ing ) { throw Error(`transpiling`); }
	ing = true;
};

export let ts :string = '';
export const set_ts = (value :string) :void => {
	if ( typeof value!=='string' ) { throw TypeError(`transpileModule(!string)`); }
	ts = value;
};

export let filename :string | undefined;
export const set_filename = (value :string | undefined) :void => {
	if ( typeof value==='string' ) { filename = value; }
	else if ( value!==undefined ) { throw TypeError(`transpileModule(,,!string)`); }
};

export const off = () :void => {
	ts = '';
	filename = undefined;
	ing = false;
};
