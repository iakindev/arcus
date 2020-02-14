debug = debugThis => window.globalDebug(debugThis);
let dir;
let rawConfig;

if (window.platform === 'darwin') {
	dir = `/Users/${window.getUsername}/Library/Application Support`;
} else if (window.platform === 'linux') {
	dir = `/home/${window.getUsername}/.local/share`;
}

const protonMap = window.fs.readFileSync(
	`${dir}/${window.appName}/protonMap.json`,
	'utf8'
);

const getConfig = () => {
	rawConfig = window.fs.readFileSync(`${dir}/${window.appName}/config.json`);
	config = JSON.parse(rawConfig);
};

const writeConfig = () => {
	window.fs.writeFileSync(
		`${dir}/${window.appName}/config.json`,
		JSON.stringify(config, null, 4),
		err => {
			if (err) throw err;
			debug('The file has been saved!');
		}
	);
	getConfig();
};

debug(JSON.parse(protonMap));

const parseProton = obj => {
	const arr = [];
	debug(obj['common']);
	for (i = 0; i <= Object.keys(obj['common']).length - 1; i += 1) {
		debug(obj['common'][i]['name']);
		arr.push({ prefix: 'common', label: obj['common'][i]['name'] });
	}
	if (obj['compatibilitytools'] !== undefined) {
		for (
			i = 0;
			i <= Object.keys(obj['compatibilitytools']).length - 1;
			i += 1
		) {
			debug(obj['compatibilitytools'][i]['name']);
			arr.push({
				prefix: 'compatibilitytools',
				label: obj['compatibilitytools'][i]['name']
			});
		}
	}

	return arr;
};

debug(parseProton(JSON.parse(protonMap)));

const cleanRightList = () => {
	const rightList = document.getElementById('rightMenuList');
	rightList.innerHTML = '';
};

const createBottomNav = () => {
	const bottomNav = document.createElement('nav');
	bottomNav.id = 'bottomNav';
	bottomNav.classList.add(
		'navbar',
		'navbar-expand-sm',
		'bg-dark',
		'navbar-dark',
		'fixed-bottom'
	);
	const doneButtonA = document.createElement('a');
	doneButtonA.classList.add('navbar-nav', 'ml-auto');
	const doneButton = document.createElement('button');
	doneButton.id = 'done';
	doneButton.type = 'button';
	doneButton.classList.add('btn', 'btn-primary');
	doneButton.innerText = 'DONE';
	doneButtonA.appendChild(doneButton);
	bottomNav.appendChild(doneButtonA);
	document.body.appendChild(bottomNav);
};

removeBottomNav = () => {
	const bottomNav = document.getElementById('bottomNav');
	if (bottomNav) document.body.removeChild(bottomNav);
};

const createInput = (id, text, placeholder) => {
	const rightList = document.getElementById('rightMenuList');
	const outerDiv = document.createElement('div');
	outerDiv.classList.add('input-group', 'mb-3');
	outerDiv.style = 'margin-bottom: 0px!important;';
	const innerDiv = document.createElement('div');
	innerDiv.classList.add('input-group-prepend');
	const label = document.createElement('span');
	label.classList.add('input-group-text');
	label.id = id;
	label.innerText = text;
	const textInput = document.createElement('input');
	textInput.type = 'text';
	textInput.classList.add('form-control');
	textInput.placeholder = placeholder;
	textInput.setAttribute('aria-label', 'apikey');
	textInput.setAttribute('aria-describedby', id);
	innerDiv.appendChild(label);
	outerDiv.appendChild(innerDiv);
	outerDiv.appendChild(textInput);
	const listItem = document.createElement('li');
	listItem.classList.add('list-group-item');
	listItem.appendChild(outerDiv);
	rightList.appendChild(listItem);
};

const createSelect = (id, lbl, obj, defaultValue) => {
	const outerDiv = document.createElement('div');
	outerDiv.classList.add('input-group', 'mb-3');
	outerDiv.style = 'margin-bottom: 0px!important;';
	const innerDiv = document.createElement('div');
	innerDiv.classList.add('input-group-prepend');
	const label = document.createElement('label');
	label.classList.add('input-group-text');
	label.htmlFor = id;
	label.innerText = lbl;
	const selection = document.createElement('select');
	selection.classList.add('custom-select');
	selection.id = id;

	let optionDefault;
	if (defaultValue !== undefined) {
		optionDefault = document.createElement('option');
		optionDefault.selected = true;
		optionDefault.value = defaultValue['text'];
		try {
			optionDefault.dataset.location = obj[i]['prefix'];
		} catch {
			optionDefault.dataset.location = 'common';
		}
		optionDefault.innerText = `${defaultValue['location']}: ${defaultValue['text']}`;
		selection.appendChild(optionDefault);
	}

	for (i = 0; i <= obj.length - 1; i += 1) {
		if (
			(defaultValue !== undefined) &
			(optionDefault.value === obj[i]['label'])
		) {
			continue;
		}
		let option = document.createElement('option');
		option.value = obj[i]['label'];
		option.dataset.location = obj[i]['prefix'];
		option.innerText = `${obj[i]['prefix']}: ${obj[i]['label']}`;
		selection.appendChild(option);
	}

	innerDiv.appendChild(label);
	outerDiv.appendChild(innerDiv);
	outerDiv.appendChild(selection);
	const rightList = document.getElementById('rightMenuList');
	const listItem = document.createElement('li');
	listItem.classList.add('list-group-item');
	listItem.appendChild(outerDiv);
	rightList.appendChild(listItem);
};

const protonMenu = () => {
	cleanRightList();
	removeBottomNav();
	// Version Select
	getConfig();
	createSelect(
		'protonVersions',
		'Version',
		parseProton(JSON.parse(protonMap)),
		{
			location: config.protonVersion.location,
			text: config.protonVersion.version
		}
	);
	createBottomNav();
	document.getElementById('done').addEventListener('click', () => {
		getConfig();
		const protonVersions = document.getElementById('protonVersions');
		debug(protonVersions.options[protonVersions.selectedIndex].value);
		config.protonVersion = {
			version: protonVersions.options[protonVersions.selectedIndex].value,
			location:
				protonVersions.options[protonVersions.selectedIndex].dataset.location
		};
		debug(config);
		writeConfig();
		window.ipcRenderer.send('gen-run-script');
	});
};

const apiKeyMenu = () => {
	cleanRightList();
	removeBottomNav();
	createInput('apikey', 'Api Key', 'Api Key');
	createBottomNav();
};

// Menu event listeners
document
	.getElementById('protonMenu')
	.addEventListener('click', () => protonMenu());

document
	.getElementById('apiKeyMenu')
	.addEventListener('click', () => apiKeyMenu());
// First item on menu
protonMenu();
