const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');

function handler() {
    window.opener?.postMessage('handler', '*');

    if(targetSite) goTarget(targetSite);
}

function goTarget(url) {
    window.location.href = url;
}

function goAnotherLanding() {
    window.opener?.postMessage('goAnotherLanding', '*');
    const landingList = [
        'https://bot-verify.onrender.com/',
        'https://bot-detector.onrender.com/',
        'https://bot-notify.onrender.com/',
        'https://bot-warning.onrender.com/',
        'https://human-verify.onrender.com/'
    ];

    const currentId = landingList.findIndex(landing => landing.includes(window.location.hostname));
    const nextId = currentId + 1;
    if(nextId >= landingList.length) alert('We cannot confirm that you are human.');
    else goTarget(landingList[nextId] + queryString);
}
