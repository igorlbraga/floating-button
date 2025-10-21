function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays = 30) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax";
}

function getURLCampaignParameters() {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    const campaignParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'gad_source',
        'gad_campaignid',
        'gbraid',
        'gclid',
        "wbraid",
        'fbclid',
        'msclkid'
    ];

    campaignParams.forEach(param => {
        const value = params.get(param);
        if (value) {
            result[param] = value;
        }
    });

    return result;
}

function getTrafficSource() {
    let source = "";
    let referrerHost = "";

    const currentHost = window.location.hostname.toLowerCase();

    if (document.referrer) {
        const referrerUrl = new URL(document.referrer);
        referrerHost = referrerUrl.hostname.toLowerCase()
    }

    if (referrerHost && (referrerHost !== currentHost) && (referrerHost !== ('www.' + currentHost)) && (('www.' + referrerHost) !== currentHost)) source = referrerHost;
    else if (navigator.userAgent.toLowerCase().includes('whatsapp')) source = 'whatsapp.com';

    return source;
}

function initTracking() {
    const campaignParams = getURLCampaignParameters();

    if (Object.keys(campaignParams).length > 0) setCookie('track_campaign_data', JSON.stringify(campaignParams), 1);

    const trafficSource = getTrafficSource();

    const existingSource = getCookie('track_source_data');
    if (!existingSource && trafficSource)
        setCookie('track_source_data', trafficSource, 1);
}

function getTrackingData() {
    const campaignData = getCookie('track_campaign_data');

    const sourceData = getCookie('track_source_data');

    return { campaignData: campaignData || "", sourceData: sourceData || "" };
}

initTracking()

const trackingData = window.getTrackingData()

if (trackingData.campaignData) {
    const campaignDataFields = document.querySelectorAll('input[name*="87_campaign_data_31"]')
    campaignDataFields.forEach(cd => {
        cd.value = trackingData.campaignData
    })
} else {
    const campaignParams = getURLCampaignParameters()
    if (Object.keys(campaignParams).length > 0) {
        const campaignData = JSON.stringify(campaignParams);
        const campaignDataFields = document.querySelectorAll('input[name*="87_campaign_data_31"]')
        campaignDataFields.forEach(cd => {
            cd.value = campaignData
        })
    }

}
if (trackingData.sourceData) {
    const sourceDataFields = document.querySelectorAll('input[name*="87_source_data_31"]')
    sourceDataFields.forEach(cd => {
        cd.value = trackingData.sourceData
    })
}