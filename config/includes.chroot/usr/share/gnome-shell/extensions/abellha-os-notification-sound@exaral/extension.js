import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Gio from 'gi://Gio';

export default class NotificationSoundExtension extends Extension {
    enable() {
        this._soundPlayer = global.display.get_sound_player();
        this._soundFile = this.dir.get_child('sounds').get_child('sound.ogg');
        this._sourceSignals = new Map();
        this._mainSignals = [];

        let addedId = Main.messageTray.connect('source-added', (tray, source) => {
            this._connectToSource(source);
        });
        this._mainSignals.push({ obj: Main.messageTray, id: addedId });

        let removedId = Main.messageTray.connect('source-removed', (tray, source) => {
            this._disconnectFromSource(source);
        });
        this._mainSignals.push({ obj: Main.messageTray, id: removedId });

        Main.messageTray.getSources().forEach(source => {
            this._connectToSource(source);
        });

        this._lastPlayTime = 0;
        this._cooldown = 500;
    }

    _connectToSource(source) {
        if (this._sourceSignals.has(source)) return;
        let id = source.connect('notification-added', (source, notification) => {
            this._playSound(source);
        });
        this._sourceSignals.set(source, id);
    }

    _disconnectFromSource(source) {
        let id = this._sourceSignals.get(source);
        if (id) {
            source.disconnect(id);
            this._sourceSignals.delete(source);
        }
    }

    _playSound(source) {
        if (Main.messageTray.bannerBlocked) return;
        let currentTime = Date.now();
        if (currentTime - this._lastPlayTime < this._cooldown) return;
        this._lastPlayTime = currentTime;
        this._soundPlayer.play_from_file(
            this._soundFile,
            'Notification Sound',
            null
        );
    }

    disable() {
        // Uses the 'unlock-dialog' session mode (see metadata.json) so that
        // notification sounds continue to play while the screen is locked.
        this._mainSignals.forEach(s => s.obj.disconnect(s.id));
        this._mainSignals = [];
        for (let [source, id] of this._sourceSignals) {
            source.disconnect(id);
        }
        this._sourceSignals.clear();
        this._sourceSignals = null;
        this._soundPlayer = null;
        this._soundFile = null;
    }
}
