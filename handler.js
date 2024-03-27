const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');
const fetchBack = urlParams.get('fetchback');

function handler() {
    if(fetchBack && targetSite) {
        fetch(fetchBack).then(() => goTarget(targetSite));
    }
    else if(fetchBack) {
        fetch(fetchBack);
    }
    else if(targetSite) {
        goTarget(targetSite);
    }
}

function goTarget(url) {
    window.open(url, '_self');
}

function goAnotherLanding() {
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
    else goBack(landingList[nextId] + queryString);
}
