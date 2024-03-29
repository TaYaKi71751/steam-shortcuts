import path from 'path';
import fs from 'fs';
import { AddShortcut } from '../util/Shortcut';
import { getShortcutAppID } from '../util/AppID';
import { AddToCats } from '../util/Categories';

const outPath = path.join(
	`${process.env.PWD}`,
	'out',
	'kodi'
);

export async function __main__ () {
	const outFiles = fs.readdirSync(outPath);
	for (let i = 0; i < outFiles?.length; i++) {
		const filename = outFiles[i];
		const StartDir = outPath;
		const exe = path.join(outPath, filename);
		if (filename == 'run.out') {
			const { name, tags } = { name: 'Kodi', tags: ['TV', 'Kodi'] };
			const appid = getShortcutAppID({ AppName: name, exe });
			AddShortcut({ appid, AppName: name, exe, StartDir, LaunchOptions: '%command%', tags });
			for (let k = 0; k < tags?.length; k++) {
				const tag = tags[k];
				if (!tag) continue;
				await AddToCats(appid, tag);
			}
		} else if (filename == 'install.out') {
			const { name, tags } = { name: '[Kodi] Install', tags: ['Kodi', 'Install'] };
			const appid = getShortcutAppID({ AppName: name, exe });
			AddShortcut({ appid, AppName: name, exe, StartDir, LaunchOptions: '%command%', tags });
			for (let k = 0; k < tags?.length; k++) {
				const tag = tags[k];
				if (!tag) continue;
				await AddToCats(appid, tag);
			}
		}
	}
}

// https://stackoverflow.com/questions/4981891/node-js-equivalent-of-pythons-if-name-main
if (typeof require !== 'undefined' && require.main === module) {
	__main__();
}
