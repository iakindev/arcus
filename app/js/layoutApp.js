const createTripleColumn = (idPrefix, firstNode, secondNode, thirdNode) => {
	const container = document.createElement('div');
	container.classList.add('container-fluid');
	const row = document.createElement('div');
	row.classList.add('row');
	for (let i = 1; i <= 3; i += 1) {
		const column = document.createElement('div');
		column.id = `${idPrefix}-${i}`;
		column.classList.add('col-sm');
		column.style = `overflow:hidden;`;
		if (i === 1) column.appendChild(firstNode);
		if (i === 2) column.appendChild(secondNode);
		if (i === 3) column.appendChild(thirdNode);
		row.appendChild(column);
	}
	container.appendChild(row);
	return container;
};

const createTextNode = text => {
	const textNode = document.createElement('span');
	textNode.innerText = text.toString().substr(0, 50);
	textNode.classList.add('textNode');
	return textNode;
};

const createImgButtonNode = (id, title, img, hoverImg, filename, modname, modversion, func) => {
	const imgNode = document.createElement('img');
	imgNode.src = img;
	imgNode.title = title;
	if (hoverImg) {
		imgNode.addEventListener('mouseover', () => {
			imgNode.src = hoverImg;
		});
		imgNode.addEventListener('mouseleave', () => {
			imgNode.src = img;
		});
	}
	if (filename) {
		imgNode.classList.add('clickable');
		imgNode.addEventListener('click', () => {
			func(filename, modname, modversion);
		});
	}

	return imgNode;
};

const createModsListItem = (id, modname, version) => {
	document.getElementById('noMods').style.display = 'none';
	const modList = document.getElementById('modList');
	const listItem = document.createElement('li');
	listItem.classList.add('list-group-item');
	listItem.style.padding = 0;
	const innerList = document.createElement('ul');
	innerList.classList.add('list-group', 'list-group-horizontal-sm');
	innerList.style.width = '100%';
	const createInnerListItem = (node, marginLeft) => {
		const el = document.createElement('li');
		if (marginLeft) el.classList.add('ml-auto');
		el.classList.add('list-group-item', 'list-item-seperate');
		el.style.border = 0;
		el.appendChild(node);
		return el;
	};

	const div = document.createElement('div');
	div.classList.add('custom-control', 'custom-checkbox');
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.classList.add('custom-control-input');
	input.id = modname;
	const label = document.createElement('label');
	label.classList.add('custom-control-label');
	label.htmlFor = modname;
	label.innerText = modname;
	div.appendChild(input);
	div.appendChild(label);
	innerList.appendChild(createInnerListItem(div));
	innerList.appendChild(createInnerListItem(createTextNode(`v: ${version}`)));
	innerList.appendChild(createInnerListItem(createTextNode(`d: date`)));
	innerList.appendChild(createInnerListItem(createTextNode('1'), true)); // priority
	listItem.appendChild(innerList);
	modList.appendChild(listItem);
};

const showClearHistory = () => {
	document.getElementById('downloadsButton').classList.add('downloadsBtn-clicked');
	document.getElementById('clearHistory').classList.remove('d-none');
	document.getElementById('clearHistory').classList.add('d-initial');
	document.getElementById('downloadsText').style = `margin-left: 5vh; transition: margin-left 250ms ease-in;`;
};

const hideClearHistory = () => {
	document.getElementById('downloadsButton').classList.remove('downloadsBtn-clicked');
	document.getElementById('clearHistory').classList.remove('display-initial');
	document.getElementById('downloadsText').style = `transition: margin-left 250ms ease-in;`;
	setTimeout(() => {
		document.getElementById('clearHistory').classList.remove('d-initial');
		document.getElementById('clearHistory').classList.add('d-none');
	}, 250);
};

// update progress bar of download
const updateProgress = (id, value) => {
	document.getElementById(id).getElementsByClassName('progress-bar')[0].style.width = `${value}%`;
};

// update progress text of download
const updateProgressText = (id, value) => {
	document.getElementById(id).getElementsByClassName('textNode')[0].innerText = `${value}%`;
};

exports.createTripleColumn = createTripleColumn;
exports.createImgButtonNode = createImgButtonNode;
exports.createModsListItem = createModsListItem;
exports.createTextNode = createTextNode;
exports.showClearHistory = showClearHistory;
exports.hideClearHistory = hideClearHistory;
exports.updateProgress = updateProgress;
exports.updateProgressText = updateProgressText;
