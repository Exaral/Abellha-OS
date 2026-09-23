import { InjectionManager } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
export class NotificationDaemonManager {
    injectionManager = new InjectionManager();
    getSourceForAppHooks = [];
    getSourceForPidAndNameHooks = [];
    currentNotification = null;
    registerGetSourceForAppHook(hook) {
        this.getSourceForAppHooks.push(hook);
    }
    registerGetSourceForPidAndNameHook(hook) {
        this.getSourceForPidAndNameHooks.push(hook);
    }
    enable() {
        this.patchNotifyAsync();
        this.patchGetSourceForApp();
        this.patchGetSourceForPidAndName();
    }
    disable() {
        this.injectionManager.clear();
    }
    getFdoNotificationDaemonProto() {
        const fdoNotificationDaemon = Main.notificationDaemon._fdoNotificationDaemon;
        return Object.getPrototypeOf(fdoNotificationDaemon);
    }
    patchNotifyAsync() {
        const proto = this.getFdoNotificationDaemonProto();
        const manager = this;
        this.injectionManager.overrideMethod(proto, "NotifyAsync", (original) => function (params, invocation) {
            const [appName, _replacesId, _appIcon, title, body] = params;
            manager.currentNotification = {
                appName,
                title,
                body,
            };
            try {
                return original.call(this, params, invocation);
            }
            finally {
                manager.currentNotification = null;
            }
        });
    }
    patchGetSourceForApp() {
        const proto = this.getFdoNotificationDaemonProto();
        const hooks = this.getSourceForAppHooks;
        const manager = this;
        this.injectionManager.overrideMethod(proto, "_getSourceForApp", (original) => function (sender, app) {
            for (const hook of hooks) {
                const source = hook((currentSender, currentApp) => original.call(this, currentSender, currentApp), sender, app, {
                    daemon: this,
                    notification: manager.currentNotification,
                });
                if (source) {
                    return source;
                }
            }
            return original.call(this, sender, app);
        });
    }
    patchGetSourceForPidAndName() {
        const proto = this.getFdoNotificationDaemonProto();
        const hooks = this.getSourceForPidAndNameHooks;
        const manager = this;
        this.injectionManager.overrideMethod(proto, "_getSourceForPidAndName", (original) => function (sender, pid, appName) {
            for (const hook of hooks) {
                const source = hook((currentSender, currentPid, currentAppName) => original.call(this, currentSender, currentPid, currentAppName), sender, pid, appName, {
                    daemon: this,
                    notification: manager.currentNotification,
                });
                if (source) {
                    return source;
                }
            }
            return original.call(this, sender, pid, appName);
        });
    }
    dispose() {
        this.disable();
        this.currentNotification = null;
        this.getSourceForAppHooks = [];
        this.getSourceForPidAndNameHooks = [];
    }
}
