import version from './version?text';
import transpileModule from './transpileModule/';
import Default from '.default';
export default Default(transpileModule, {
	transpileModule,
	version,
});