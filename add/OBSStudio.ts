import path from 'path';
import fs from 'fs';
import { AddShortcut } from '../util/Shortcut';
import { getShortcutAppID } from '../util/AppID';
import { AddToCats } from '../util/Categories';

const outPath = path.join(
	`${process.env.PWD}`,
	'out',
	'obs'
);

export async function __main__ () {
	const outFiles = fs.readdirSync(outPath);
	for (let i = 0; i < outFiles?.length; i++) {
		const filename = outFiles[i];
		const StartDir = outPath;
		const exe = path.join(outPath, filename);
		if (filename == 'obs.out') {
			const { name, tags } = { name: 'OBS Studio', tags: ['Stream'] };
			const appid = getShortcutAppID({ AppName: name, exe });
			AddShortcut({ appid, AppName: name, exe, StartDir, LaunchOptions: '%command%', tags });
			for (let k = 0; k < tags?.length; k++) {
				const tag = tags[k];
				if (!tag) continue;
				await AddToCats(appid, tag);
			}
		} else if (filename == 'install.out') {
			const { name, tags } = { name: '[OBS Studio] Install', tags: ['Install'] };
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
