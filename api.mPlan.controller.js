const axios = require('axios');
const MPlan = require("../models/api");

async function getMPlanData() {
    try{
        let { data } = await axios.get('https://movista-api-docs.s3.amazonaws.com/v2.1/json/mPlans.json');
        console.log(data)
        let { required, properties } = data.components.schemas.mPlan.allOf[1].properties.Data;  ///data.required == data[variableName];

        return new MPlan(required, properties);
    } catch (error) {
        console.log(error)
    }
};


module.exports = {
    getMPlanData,
}