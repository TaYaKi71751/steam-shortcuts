#!/bin/bash

# https://superuser.com/questions/553932/how-to-check-if-i-have-sudo-access
SUDO_EXECUTOR="$(sudo -nv && echo sudo || echo pkexec)"

SHELL_RUN_COMMANDS=`find ~ -maxdepth 1 -name '.*shrc'`
for shrc in ${SHELL_RUN_COMMANDS[@]};do
	echo "source ${shrc}"
	source ${shrc}
done

TAILSCALE_OPTIONS="${TAILSCALE_OPTIONS} --reset "
TAILSCALE_OPTIONS="${TAILSCALE_OPTIONS} --exit-node=${TAILSCALE_EXIT_NODE} "
TAILSCALE_OPTIONS="${TAILSCALE_OPTIONS} --ssh "
TAILSCALE_OPTIONS="${TAILSCALE_OPTIONS} --operator=${HOSTNAME} "
if [ -n "${TAILSCALE_EXIT_NODE}" ];then
	TAILSCALE_OPTIONS="${TAILSCALE_OPTIONS} --exit-node-allow-lan-access "
fi


function up(){
	DAEMON_STATUS=`sudo ps -A | grep tailscaled`
	if [ -n "${DAEMON_STATUS}" ];then
		echo "tailscaled already running"
		echo ${TAILSCALE_OPTIONS}
		sudo tailscale up ${TAILSCALE_OPTIONS}
	else
		echo "tailscaled not running, run tailscaled"
		sudo systemd-run tailscaled
		up
	fi
}

# https://unix.stackexchange.com/questions/269078/executing-a-bash-script-function-with-sudo
FUNC=$(declare -f up)
pkexec bash -c "$(env) ; TAILSCALE_OPTIONS=\"${TAILSCALE_OPTIONS}\"; $FUNC; up"

