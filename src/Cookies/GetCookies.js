function encodeBase64(value) {
    return btoa(value); 
}

function decodeBase64(value) {
    return atob(value);
}


export function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            const encodedValue= cookie.substring(name.length + 1);
            return decodeBase64(encodedValue)
        }
    }
    return null;
}

export function clearCookies() {
    document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
};

export function setCookie(cookieName, value) {
    const oneday = 24 * 60 * 60;
    const encodedValue = encodeBase64(value);
    document.cookie = `${cookieName}=${encodedValue}; path=/; max-age=${oneday}`;
};