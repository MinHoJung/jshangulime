var browser = {
isIe : document.all && !window.opera,
isModern : document.getElementById && !document.all,
isOpera: window.opera && document.getElementById,
isGecko:navigator.userAgent.indexOf('Gecko') != -1,
isFirefox: navigator.userAgent.indexOf('Firefox') != -1,
isSafari: navigator.userAgent.indexOf('Safari') != -1
}
