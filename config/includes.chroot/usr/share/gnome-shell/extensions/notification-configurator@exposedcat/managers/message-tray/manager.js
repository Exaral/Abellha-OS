import * as MessageTray from "resource:///org/gnome/shell/ui/messageTray.js";
import { InjectionManager } from "resource:///org/gnome/shell/extensions/extension.js";
export class MessageTrayManager {
    settingsManager;
    injectionManager = new InjectionManager();
    updateStateHooks = [];
    updateNotificationTimeoutHooks = [];
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }
    registerUpdateStateHook(hook) {
        this.updateStateHooks.push(hook);
    }
    registerUpdateNotificationTimeoutHook(hook) {
        this.updateNotificationTimeoutHooks.push(hook);
    }
    enable() {
        this.patchUpdateState();
        this.patchUpdateNotificationTimeout();
    }
    disable() {
        this.injectionManager.clear();
    }
    patchUpdateState() {
        const hooks = this.updateStateHooks;
        const messageTrayProto = MessageTray.MessageTray
            .prototype;
        this.injectionManager.overrideMethod(messageTrayProto, "_updateState", (original) => function () {
            let originalCalled = false;
            for (const hook of hooks) {
                hook(() => {
                    if (!originalCalled) {
                        originalCalled = true;
                        return original.call(this);
                    }
                }, { tray: this });
            }
            if (!originalCalled) {
                return original.call(this);
            }
        });
    }
    patchUpdateNotificationTimeout() {
        const messageTrayProto = MessageTray.MessageTray
            .prototype;
        const hooks = this.updateNotificationTimeoutHooks;
        this.injectionManager.overrideMethod(messageTrayProto, "_updateNotificationTimeout", (original) => function (timeout) {
            let finalTimeout = timeout;
            for (const hook of hooks) {
                finalTimeout = hook((timeout) => original.call(this, timeout), finalTimeout, { tray: this });
                if (finalTimeout === null) {
                    break;
                }
            }
            if (finalTimeout !== null) {
                return original.call(this, finalTimeout);
            }
        });
    }
    dispose() {
        this.disable();
        this.updateStateHooks = [];
        this.updateNotificationTimeoutHooks = [];
    }
}
