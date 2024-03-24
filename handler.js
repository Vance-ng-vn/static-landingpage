const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const targetSite = urlParams.get('target');
const backSite = urlParams.get('back');

function handler(){
    goTarget();
    goBack();
}

function goBack(url) {
    window.location = url + (url.includes('?') ? '&key=' + new Date().getTime() : '?key=' + new Date().getTime());
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
    if(nextId < landingList.length) goBack(landingList[nextId] + queryString);
    else handler();
}
