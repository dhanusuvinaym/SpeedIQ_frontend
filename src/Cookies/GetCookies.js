
function encodeBase64(value) {

    return encodeURIComponent(value)
    // return value;
    // const compressed = LZString.compressToBase64(value);
    // return btoa(encodeURIComponent(compressed));
}

function decodeBase64(value) {
    return decodeURIComponent(value)
    // return value;
    // const decoded = decodeURIComponent(atob(value));
    // return LZString.decompressFromBase64(decoded);
}

export function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            const encodedValue = cookie.substring(name.length + 1);
            return decodeBase64(encodedValue)
        }
    }
    return null;
}

export function clearCookies(tokenId) {
    document.cookie.split(";").forEach((cookie) => {
        cookie = cookie.trim();
        const cookieName = cookie.split("=")[0].trim();
        if (cookieName.startsWith(tokenId + "-")) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    });
};

export function setCookie(cookieName, value) {
    const oneday = 24 * 60 * 60;
    const encodedValue = encodeBase64(value);
    document.cookie = `${cookieName}=${encodedValue}; path=/; max-age=${oneday}`;
};