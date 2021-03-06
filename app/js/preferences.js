const debug = debugThis => window.globalDebug(debugThis);
const { ipcRenderer, fs, join } = window;
const { configFunctions, layoutPreferences, protonSupport, globalVariables } = window;
let config;

debug(JSON.parse(protonSupport.protonMap()));

debug(protonSupport.parseProton(JSON.parse(protonSupport.protonMap())));

const protonMenu = () => {
	layoutPreferences.cleanRightList();
	layoutPreferences.removeBottomNav();
	// Version Select
	config = configFunctions.getConfig();
	layoutPreferences.createSelect(
		'protonVersions',
		'Version',
		protonSupport.parseProton(JSON.parse(protonSupport.protonMap())),
		{
			location: config.protonVersion.location,
			text: config.protonVersion.version,
		}
	);
	layoutPreferences.createBottomNav(true);
	document.getElementById('done').addEventListener('click', () => {
		config = configFunctions.getConfig();
		const protonVersions = document.getElementById('protonVersions');
		debug(protonVersions.options[protonVersions.selectedIndex].value);
		config.protonVersion = {
			version: protonVersions.options[protonVersions.selectedIndex].value,
			location: protonVersions.options[protonVersions.selectedIndex].dataset.location,
		};
		debug(config);
		configFunctions.writeConfig(config);
		config = configFunctions.getConfig();
		ipcRenderer.send('gen-run-script');
	});
};

const apiKeyMenu = () => {
	layoutPreferences.cleanRightList();
	layoutPreferences.removeBottomNav();
	layoutPreferences.createInput('apikey', 'Api Key', 'Api Key');
	if (fs.existsSync(join(`${globalVariables.appDataDir()}/${globalVariables.appName}/apikey`))) {
		document.getElementById('apikey').value = fs.readFileSync(
			join(`${globalVariables.appDataDir()}/${globalVariables.appName}/apikey`),
			'utf8'
		);
	}
	layoutPreferences.createBottomNav(true);
	document.getElementById('done').addEventListener('click', () => {
		debug(document.getElementById('apikey').value);
		fs.writeFileSync(
			join(`${globalVariables.appDataDir()}/${globalVariables.appName}/apikey`),
			document.getElementById('apikey').value,
			err => {
				if (err) throw err;
				debug('The file has been saved!');
			}
		);
	});
};

const aboutMenu = () => {
	layoutPreferences.cleanRightList();
	layoutPreferences.removeBottomNav();
	if (fs.existsSync('license.txt')) {
		layoutPreferences.createAllText(fs.readFileSync('license.txt', 'utf8'));
	} else {
		layoutPreferences.createAllText(
			'license.txt couldn\'t found. If you are in development version please execute "npm run genLicenseFile"'
		);
	}
	layoutPreferences.createBottomNav();
};

// Menu event listeners
document.getElementById('protonMenu').addEventListener('click', () => protonMenu());

document.getElementById('apiKeyMenu').addEventListener('click', () => apiKeyMenu());

document.getElementById('aboutMenu').addEventListener('click', () => aboutMenu());

// First item on menu
protonMenu();
