const Role = require("../models/api");
const axios = require('axios');


async function getRolesData() {
    let { data } = await axios.get('https://movista-api-docs.s3.amazonaws.com/v2.1/json/Roles.json');
    let { required, properties } = data.components.schemas.Role.allOf[1].properties.Data;  ///data.required == data[variableName];

    return new Role(required, properties);    ///
};


module.exports = {
    getRolesData,
}
