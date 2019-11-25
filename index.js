'use strict';
const fs = require('fs');
const parser = require('./parser');

const ignore = ['node_modules', '.git']

if (process.argv.length != 3) {
	console.log('Invalid arguments! call with \'node index.js ${absolute path}\'');
	process.exit(1);
}
const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
	console.log(`${dir} is not a valid directory!`);
	process.exit(1);
}

let graph = {};
if (fs.existsSync(`graph.json`)) {
	let rawdata = fs.readFileSync('graph.json');
	graph = JSON.parse(rawdata);
	if (graph.path !== process.argv[2]) {
		graph = {
			path: process.argv[2],
			timeline: [],
		};
	}
} else {
	graph = {
		path: process.argv[2],
		timeline: [],
	};
}

console.log(`Analyzing ${dir}`)

const getAllFiles = function (directory) {
	let files = [];
	fs.readdirSync(`${directory}/`).forEach((file) => {
		// If directory, recurse
		if (fs.lstatSync(`${directory}/${file}`).isDirectory()) {
			if (!ignore.includes(file)) {
				files = files.concat(getAllFiles(`${directory}/${file}`));
			}
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
		require('child_process').exec(`git -C ${dir} rev-parse --short=7 HEAD`, function(err, stdout) {
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
		require('child_process').exec(`git -C ${dir} show --no-patch --no-notes --pretty=\'%cd\' ${commit}`, function(err, stdout) {
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
	
	let nodes = [];
	let links = [];
	console.log("Parsing files ... ")
	files.forEach((file) => {
		// console.log(`Parsing ${file}`);
		const parsed = parser.parse(file);
		nodes = nodes.concat(parsed.nodes);
		links = links.concat(parsed.links);
	});

	// Clear out any invalid parsed links (referencing classes that weren't parsed, like node_modules)
	const classIds = [];
	nodes.forEach((node) => {
		classIds.push(node.id);
	});
	links = links.filter((link) => {
		return classIds.includes(link.source) && classIds.includes(link.target)
	})
	
	const commitData = {
		commit,
		datetime,
		nodes,
		links,
	}

	// Ensure timeline is unique commits
	const timeline = new Map();
	graph.timeline.forEach((commit) => {
		timeline.set(commit.commit, commit);
	})
	timeline.set(commitData.commit, commitData);
	graph.timeline = Array.from(timeline.values());
	// Sort timeline by datetime
	graph.timeline.sort( (a, b) => {
		const adate = Date.parse(a.datetime);
		const bdate = Date.parse(b.datetime);
		if (adate < bdate) {
			return -1;
		}
		if (adate > bdate) {
			return 1;
		}
		return 0;
	});

	let graphdata = JSON.stringify(graph);
	fs.writeFileSync('graph.json', graphdata);

	// console.log(graphdata);
}

main();