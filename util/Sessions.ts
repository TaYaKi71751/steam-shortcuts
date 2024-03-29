import { execSync } from 'child_process';

export function getWaylandSessions () {
	return execSync('find /usr/share/wayland-sessions -type f').toString().split('\n').filter((l) => (l.length));
}

export function getXSessions () {
	return execSync('find /usr/share/xsessions -type f').toString().split('\n').filter((l) => (l.length));
}
