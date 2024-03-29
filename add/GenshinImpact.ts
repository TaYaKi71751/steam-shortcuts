import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { getShortcutAppID } from '../util/AppID';
import { AddShortcut, RemoveShortcutStartsWith } from '../util/Shortcut';
import { AddToCats } from '../util/Categories';
import { AddCompat } from '../util/Compatibilities';
import { dirname } from 'path';

export async function __main__ () {
	RemoveShortcutStartsWith({ AppName: '[Proton] Genshin Impact' });
	let filenames = execSync('find / -name \'GenshinImpact.exe\' -type f || true').toString().split('\n');
	const tags = ['Genshin Impact', 'Proton'];
	filenames = filenames
		.map((filename) => (filename.trim()))
		.filter((filename) => (filename.length))
		.filter((filename) => {
			try {
				if (existsSync(filename)) {
					return true;
				}
			} catch (e) { return false; }
			return false;
		});
	for (const filename of filenames) {
		const StartDir = dirname(filename);
		const exe = JSON.stringify(filename);
		const AppName = `[Proton] Genshin Impact (${filename})`;
		const appid = getShortcutAppID({ AppName, exe });
		AddShortcut({ appid, AppName, exe, StartDir, LaunchOptions: 'obs-gamecapture %command%' });
		for (let j = 0; j < tags?.length; j++) {
			const tag = tags[j];
			if (!tag) continue;
			await AddToCats(appid, tag);
		}
		AddCompat({ appid: `${appid}`, compat: 'proton_7' });
	}
}

// https://stackoverflow.com/questions/4981891/node-js-equivalent-of-pythons-if-name-main
if (typeof require !== 'undefined' && require.main === module) {
	__main__();
}
