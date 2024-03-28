const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');

function handler() {
    window.opener?.postMessage('handler', '*');

    if(targetSite) window.location.href = targetSite;
}
function goAnotherLanding() {
    window.opener?.postMessage('goAnotherLanding', '*');
}
