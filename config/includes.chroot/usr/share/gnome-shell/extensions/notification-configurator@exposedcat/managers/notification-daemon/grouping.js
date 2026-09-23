import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { FdoNotificationDaemonSource } from "resource:///org/gnome/shell/ui/notificationDaemon.js";
export class GroupingAdapter {
    settingsManager;
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }
    createGetSourceForAppHook() {
        const settingsManager = this.settingsManager;
        return (_original, sender, app, context) => {
            const notification = context.notification;
            if (!notification) {
                return null;
            }
            if (!settingsManager.shouldDisableNotificationGroupingFor(app.get_name(), notification.title, notification.body)) {
                return null;
            }
            const source = new FdoNotificationDaemonSource(sender, app);
            Main.messageTray.add(source);
            return source;
        };
    }
    createGetSourceForPidAndNameHook() {
        const settingsManager = this.settingsManager;
        return (_original, sender, _pid, appName, context) => {
            const notification = context.notification;
            if (!notification) {
                return null;
            }
            if (!settingsManager.shouldDisableNotificationGroupingFor(appName ?? notification.appName, notification.title, notification.body)) {
                return null;
            }
            const source = new FdoNotificationDaemonSource(sender, null);
            Main.messageTray.add(source);
            return source;
        };
    }
    register(manager) {
        manager.registerGetSourceForAppHook(this.createGetSourceForAppHook());
        manager.registerGetSourceForPidAndNameHook(this.createGetSourceForPidAndNameHook());
    }
    dispose() { }
}
