import * as MessageTray from "resource:///org/gnome/shell/ui/messageTray.js";
export class UrgencyAdapter {
    settingsManager;
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }
    createHook() {
        const settingsManager = this.settingsManager;
        return (_addNotification, notification, _context) => {
            const sourceTitle = notification.source?.title ?? "UNK_SRC";
            const configuration = settingsManager.getConfigurationFor(sourceTitle, notification.title ?? "", notification.body ?? "");
            if (!configuration.enabled) {
                return;
            }
            if (configuration.timeout.enabled &&
                configuration.timeout.notificationTimeout === 0) {
                notification.urgency = MessageTray.Urgency.CRITICAL;
            }
            else if (configuration.urgency.alwaysNormalUrgency) {
                notification.urgency = MessageTray.Urgency.NORMAL;
            }
        };
    }
    register(manager) {
        manager.registerAddNotificationHook(this.createHook());
    }
    dispose() { }
}
