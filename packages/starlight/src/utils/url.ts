const HTTPProtocolRegEx = /^https?:\/\//;

/** Check if a string starts with one of `http://` or `https://`. */
export const isAbsoluteUrl = (link: string) => HTTPProtocolRegEx.test(link);
