import * as Main from "resource:///org/gnome/shell/ui/main.js";
export function getMessageTrayContainer() {
    return Main.messageTray.get_first_child();
}
export function getBannerBin() {
    return Main.messageTray._bannerBin;
}
export function getFirstBannerRow() {
    return (getBannerBin()
        ?.get_first_child()
        ?.get_child_at_index(0)
        ?.get_child_at_index(0) ?? null);
}
export function hideBannerAppTitleRow() {
    const appTitleRow = getFirstBannerRow();
    if (!appTitleRow)
        return false;
    for (const _ of [0, 1]) {
        const child = appTitleRow.get_child_at_index(0);
        child?.get_parent()?.remove_child(child);
    }
    appTitleRow.set_x_expand(false);
    appTitleRow.get_parent()?.remove_child(appTitleRow);
    const targetWrapper = getFirstBannerRow();
    targetWrapper?.set_style("margin-top: 2px !important");
    targetWrapper?.add_child(appTitleRow);
    return true;
}
function getNotificationMetadata(container) {
    return container.notificationConfiguratorMetadata;
}
function setNotificationMetadata(container, metadata) {
    container.notificationConfiguratorMetadata =
        metadata;
}
function readText(actor) {
    return actor?.text ?? "";
}
export function resolveNotificationWidgets(messageTrayContainer) {
    const container = messageTrayContainer?.get_first_child();
    if (!container)
        return null;
    const notification = container.get_first_child();
    const header = notification?.get_first_child() !== notification?.get_last_child()
        ? notification?.get_first_child()
        : null;
    const headerContent = header?.get_child_at_index(1);
    const source = headerContent?.get_child_at_index(0);
    const sourceText = source?.get_first_child();
    const time = headerContent?.get_child_at_index(1);
    const content = notification?.get_child_at_index(1);
    const contentBody = content?.get_child_at_index(1);
    const title = contentBody?.get_child_at_index(0);
    const body = contentBody?.get_child_at_index(1);
    const metadata = getNotificationMetadata(container);
    const sourceName = sourceText?.text ?? metadata?.sourceName ?? "";
    const titleText = readText(title?.get_first_child()) || metadata?.titleText || "";
    const bodyText = readText(body?.get_first_child()) || metadata?.bodyText || "";
    setNotificationMetadata(container, {
        sourceName,
        titleText,
        bodyText,
    });
    return {
        container,
        sourceText,
        source,
        time,
        title,
        body,
        sourceName,
        titleText,
        bodyText,
    };
}
