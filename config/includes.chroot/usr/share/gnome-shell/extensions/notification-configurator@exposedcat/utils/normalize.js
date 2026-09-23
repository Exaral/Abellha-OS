import { DEFAULT_THEME } from "./constants.js";
export function normalizeAction(value, fallback = "hide") {
    if (value === "close" || value === "hide") {
        return value;
    }
    return fallback;
}
export function normalizePosition(value) {
    return value === "fill" || value === "left" || value === "right"
        ? value
        : "center";
}
export function normalizeVerticalPosition(value) {
    return value === "fill" || value === "center" || value === "bottom"
        ? value
        : "top";
}
export function normalizeBoolean(candidate, fallback) {
    return typeof candidate === "boolean" ? candidate : fallback;
}
export function normalizeString(candidate, fallback) {
    return typeof candidate === "string" ? candidate : fallback;
}
export function normalizeNumber(candidate, fallback) {
    return typeof candidate === "number" && Number.isFinite(candidate)
        ? candidate
        : fallback;
}
export function normalizeInteger(candidate, fallback) {
    return Math.trunc(normalizeNumber(candidate, fallback));
}
export function normalizeColor(candidate, fallback) {
    if (!Array.isArray(candidate) || candidate.length !== 4) {
        return [...fallback];
    }
    const normalized = [];
    for (const [index, value] of candidate.entries()) {
        normalized.push(normalizeNumber(value, fallback[index]));
    }
    return normalized;
}
export function normalizeMargins(candidate) {
    const object = (candidate ?? {});
    return {
        top: normalizeNumber(object.top, 0),
        bottom: normalizeNumber(object.bottom, 0),
        left: normalizeNumber(object.left, 0),
        right: normalizeNumber(object.right, 0),
    };
}
export function normalizeTheme(theme) {
    const candidate = (theme ?? {});
    return {
        appNameColor: normalizeColor(candidate.appNameColor, DEFAULT_THEME.appNameColor),
        timeColor: normalizeColor(candidate.timeColor, DEFAULT_THEME.timeColor),
        backgroundColor: normalizeColor(candidate.backgroundColor, DEFAULT_THEME.backgroundColor),
        titleColor: normalizeColor(candidate.titleColor, DEFAULT_THEME.titleColor),
        bodyColor: normalizeColor(candidate.bodyColor, DEFAULT_THEME.bodyColor),
        appNameFontSize: normalizeNumber(candidate.appNameFontSize, DEFAULT_THEME.appNameFontSize),
        timeFontSize: normalizeNumber(candidate.timeFontSize, DEFAULT_THEME.timeFontSize),
        titleFontSize: normalizeNumber(candidate.titleFontSize, DEFAULT_THEME.titleFontSize),
        bodyFontSize: normalizeNumber(candidate.bodyFontSize, DEFAULT_THEME.bodyFontSize),
    };
}
