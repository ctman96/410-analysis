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
	const commit = await new Promise((resolve, reject) => {
		require('child_process').exec('git rev-parse --short=7 HEAD', function(err, stdout) {
			if (err || !stdout) {
				console.log(err);
				reject(err);
			} else {
				resolve(stdout.replace(/(\r\n|\n|\r)/gm, "")); // Clear line breaks
			}
		});
	});
	console.log(`Last commit hash on this branch is: ${commit}`);

	const datetimestr = await new Promise((resolve, reject) => {
		require('child_process').exec(`git show --no-patch --no-notes --pretty=\'%cd\' ${commit}`, function(err, stdout) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(stdout);
			}
		});
	});
	console.log(`Commit datetime is: ${datetimestr}`);

	const datetime = new Date(datetimestr).toISOString();
	console.log(`Commit date is: ${datetime}`);

	const files = getAllFiles(dir);
	
	const nodes = [];
	const links = [];
	files.forEach((file) => {
		console.log(`Parsing ${file}`);
		const parsed = {}// TODO call Matteo's parser
		nodes.concat(parsed.node);
		links.concat(parsed.links);
	});

	const out = {
		commit,
		datetime,
		nodes,
		links,
	}

	console.log(out);
	// TODO output?
}

main();