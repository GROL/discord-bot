/**
 * Join array of strings to single line with line numbers and "\n" character
 * @param {array} lines Array of stings
 */
export function joinWithNumberLine(lines) {
    return lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
}

/**
 * Show Nickname with special symbols as plain code
 * @param {String} name Nickname
 */
export function correctNameForDiscord(name) {
    return '`' + name + '`';
}

/**
 * Ecraning discord spec symbols
 * @param {string} descroption
 */
export function correctDescriptionForDiscord(descroption) {
    return descroption.replace(/[\_`*]/g, '\\$&');
}
