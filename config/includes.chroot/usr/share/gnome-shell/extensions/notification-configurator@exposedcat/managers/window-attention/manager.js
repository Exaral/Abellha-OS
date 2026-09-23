import { InjectionManager } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
export class WindowAttentionManager {
    injectionManager = new InjectionManager();
    hooks = [];
    registerHook(hook) {
        this.hooks.push(hook);
    }
    enable() {
        this.patchHandler();
        this.reconnectSignals();
    }
    disable() {
        this.injectionManager.clear();
    }
    patchHandler() {
        const proto = Object.getPrototypeOf(Main.windowAttentionHandler);
        const hooks = this.hooks;
        this.injectionManager.overrideMethod(proto, "_onWindowDemandsAttention", (original) => function (display, window) {
            let originalCalled = false;
            const runOriginal = () => {
                if (originalCalled) {
                    return;
                }
                originalCalled = true;
                original.call(this, display, window);
            };
            for (const hook of hooks) {
                let handled = false;
                try {
                    handled = hook(runOriginal, window);
                }
                catch (error) {
                    console.error("[WindowAttentionManager] hook failed", error);
                }
                if (handled || originalCalled) {
                    return;
                }
            }
            runOriginal();
        });
    }
    reconnectSignals() {
        const attentionHandler = Main.windowAttentionHandler;
        const display = global.display;
        const callback = (currentDisplay, window) => attentionHandler._onWindowDemandsAttention(currentDisplay, window);
        if (typeof display.connectObject === "function" &&
            typeof display.disconnectObject === "function") {
            display.disconnectObject(attentionHandler);
            display.connectObject("window-demands-attention", callback, "window-marked-urgent", callback, attentionHandler);
            return;
        }
        if (typeof attentionHandler._windowDemandsAttentionId === "number") {
            display.disconnect(attentionHandler._windowDemandsAttentionId);
        }
        if (typeof attentionHandler._windowMarkedUrgentId === "number") {
            display.disconnect(attentionHandler._windowMarkedUrgentId);
        }
        attentionHandler._windowDemandsAttentionId = display.connect("window-demands-attention", callback);
        attentionHandler._windowMarkedUrgentId = display.connect("window-marked-urgent", callback);
    }
    dispose() {
        this.disable();
        this.hooks = [];
    }
}
