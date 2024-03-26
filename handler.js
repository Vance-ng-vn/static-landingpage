const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');
const backSite = urlParams.get('back');
const backKey = urlParams.get('backkey') === 'true' ? true : false;

function handler() {
    if(backSite && targetSite) {
        goTarget(targetSite);
        setTimeout(() => goBack(backSite), 1000);
    }
    else if(!backSite && targetSite) {
        goBack(targetSite);
    }
    else if(backSite && !targetSite) {
        goBack(backSite);
    }
}

function goBack(url, addParam = false) {
    if(addParam || backKey) url += (url.includes('?') ? '&key=' + new Date().getTime() : '?key=' + new Date().getTime());
    window.open(url, '_self');
}

function goTarget(url) {
    window.open(url);
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
