import Shell from "gi://Shell";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
export class ActivateAdapter {
    settingsManager;
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }
    createHook() {
        const settingsManager = this.settingsManager;
        const windowTracker = Shell.WindowTracker.get_default();
        return (original, window) => {
            if (!window) {
                original();
                return true;
            }
            const app = windowTracker.get_window_app(window);
            const sourceName = app?.get_name() ?? window.get_wm_class() ?? null;
            const title = window.get_title() ?? null;
            const shouldActivate = settingsManager.shouldActivateWindowOnAttentionFor(sourceName, title, null);
            if (!shouldActivate) {
                original();
                return true;
            }
            if (window.has_focus()) {
                return true;
            }
            if (window.is_skip_taskbar()) {
                return true;
            }
            const currentTime = global.get_current_time();
            const workspace = window.get_workspace();
            Main.activateWindow(window, currentTime, workspace ? workspace.index() : undefined);
            if (!window.has_focus()) {
                window.activate(currentTime);
            }
            return true;
        };
    }
    register(manager) {
        manager.registerHook(this.createHook());
    }
    dispose() { }
}
