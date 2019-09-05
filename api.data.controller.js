const axios = require('axios');
const Endpoint = require("../db").Endpoint;

wantedList = null;

async function getAPIURLs() {
    try {
        let { data } = await axios.get('https://movista-api-docs.s3.amazonaws.com/v2.1/urls-list.json');
        return data;
    } catch (error) {
        console.log(error)
    }
};

async function EndpointList() {
    if (!wantedList) {
        let urlData = await getAPIURLs();
        let urlList = urlData.urls
        let urlNames = urlList.map(url => url.name)
        let unwantedList = ['The Movista API',
        'Batch API Information',
        'API Error Codes and Messages',
        'Endpoint Table of Contents'];
        let wantedList = urlNames.filter(
            function(e) {
                return this.indexOf(e) <  0;
            }, unwantedList
        );
        wantedList.forEach(names => {
            Endpoint.findOrCreate({where: {name: names}});
            console.log(`The endpoint ${names} exists`)
        })
        // console.log(wantedList)
        return wantedList
    } else {
        wantedList.forEach(names => {
            Endpoint.findOrCreate({where: {name: names}});
            console.log(`The endpoint ${names} exists`)
        })
        return wantedList
    }

}

module.exports = {
    getAPIURLs,
    EndpointList
}
