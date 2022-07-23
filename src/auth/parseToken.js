function parseJwt (webToken) {
    return JSON.parse(Buffer.from(webToken.split('.')[1], 'base64').toString());
}

export { parseJwt };