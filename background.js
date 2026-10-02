export async function addEntry(createData) {
	let { promise, resolve, reject } = Promise.withResolvers();
	let error;
	let id = browser.menus.create(createData, () => { 
		error = browser.runtime.lastError; // Either null or an Error object.
		if (error) {
			reject(error)
		} else {
			resolve();
		}
	});

	try {
		await promise;
	} catch (error) {
		if (error.message.includes("already exists")) {
			console.info(`The menu entry <${id}> exists already and was not added again.`);
		} else {
			console.error("Failed to create menu entry:", createData, error);
		}
	}

	return id;
}

async function copyMyEmail(menuitem) {
	await navigator.clipboard.writeText("");
	let accountId = menuitem.selectedFolders[0].accountId;
	let account = await messenger.accounts.get(accountId);
	await navigator.clipboard.writeText(account.name);
}

await addEntry({
	contexts: ["folder_pane"],
	id: "copy_my_email",
	title: "Copy My Email Address",
	onclick: copyMyEmail,
});
