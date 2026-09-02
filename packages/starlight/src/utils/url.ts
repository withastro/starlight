const HTTPProtocolRegEx = /^https?:\/\//;
const ProtocolRegEx = /^[a-z][a-z\d+.-]*:/i;

/** Check if a string starts with one of `http://` or `https://`. */
export const isAbsoluteUrl = (link: string) => HTTPProtocolRegEx.test(link);

/** Check if a string contains a protocol (e.g., `http:`, `https:`, `mailto:`). */
export const hasProtocol = (link: string) => ProtocolRegEx.test(link);
