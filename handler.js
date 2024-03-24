const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');
const backSite = urlParams.get('back');

function handler() {
    if(backSite && targetSite) {
        goTarget(targetSite);
        goBack(backSite);
    }
    else if(!backSite && targetSite) {
        goBack(targetSite, false);
    }
    else if(backSite && !targetSite) {
        goBack(backSite);
    }
}

function goBack(url, addParam = true) {
    if(addParam) window.location = url + (url.includes('?') ? '&key=' + new Date().getTime() : '?key=' + new Date().getTime());
    else window.location = url;
}

function goTarget(url) {
    window.open(url, '_blank');
}

function goAnotherLanding() {
    const landingList = [
        'https://bot-verify.onrender.com/'
    ];

    const currentId = landingList.findIndex(landing => landing.includes(window.location.hostname));
    const nextId = currentId + 1;
    if(nextId >= landingList.length) alert('We cannot confirm that you are human.');
    else goBack(landingList[nextId] + queryString, false);
}