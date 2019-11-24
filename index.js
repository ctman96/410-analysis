'use strict';
// TODO require Matteo's parser
const fs = require('fs');

if (process.argv.length != 3) {
	console.log('Invalid arguments! call with \'node index.js ${absolute path}\'');
	process.exit(1);
}
const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
	console.log(`${dir} is not a valid directory!`);
	process.exit(1);
}

console.log(`Analyzing ${dir}`)

const getAllFiles = function (directory) {
	const files = [];
	fs.readdirSync(`${directory}/`).forEach((file) => {
		// If directory, recurse
		if (fs.lstatSync(`${directory}/${file}`).isDirectory()) {
			files.concat(getAllFiles(`${directory}/${file}`));
		} else {
			// Add any ts files
			if (file.match(/\.ts$/) !== null) {
				files.push(`${directory}/${file}`);
			}
		}
	})
	return files;
}

const main = async function () {
	const files = getAllFiles(dir)
	
	files.forEach((file) => {
		console.log(`Parsing ${file}`);
		const node = {}// TODO call Matteo's parser
	})
}

main();