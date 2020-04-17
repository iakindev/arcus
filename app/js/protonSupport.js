const fs = require('fs');
const { join } = require('path');

const globalVariables = require('./globalVariables');

// const { fs, join, dir, appName } = window;

const protonMap = () => {
	if (fs.existsSync(join(`${globalVariables.appDataDir()}/${globalVariables.appName}/protonMap.json`)))
		return fs.readFileSync(
			join(`${globalVariables.appDataDir()}/${globalVariables.appName}/protonMap.json`),
			'utf8'
		);
};

const parseProton = obj => {
	const arr = [];
	// debug(obj.common);
	for (let i = 0; i <= Object.keys(obj.common).length - 1; i += 1) {
		// debug(obj.common[i].name);
		arr.push({ prefix: 'common', label: obj.common[i].name });
	}
	if (obj.compatibilitytools) {
		for (let i = 0; i <= Object.keys(obj.compatibilitytools).length - 1; i += 1) {
			// debug(obj.compatibilitytools[i].name);
			arr.push({
				prefix: 'compatibilitytools',
				label: obj.compatibilitytools[i].name,
			});
		}
	}

	return arr;
};

exports.protonMap = protonMap;
exports.parseProton = parseProton;
