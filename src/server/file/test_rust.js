const { FileSystem } = require('../../../index');

(async () => {
	// await FileSystem.createDir('./test-dir');
	// await FileSystem.saveFile(Buffer.from('test data'), './test-dir/rust.js');
	// const buffer = await FileSystem.getFile('./rust.js');
	// console.log(buffer.toString())
	// await FileSystem.rename('./test-dir', './new-dir');
	// await FileSystem.removeDir('new-dir');
	await FileSystem.saveFile(Buffer.from('test data'), '../../file/rust,js');
})();
