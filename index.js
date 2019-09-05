const router = require("express").Router();
const rolesJson = require("../controller/api.roles.controller");
const mPlanJson = require('../controller/api.mPlan.controller')
const axios = require('axios');
const R = require('ramda');
const urls = require('../controller/api.data.controller');


const optionalFields = [{ required: false, type: 'string', property: 'MVID' }]  //find a better optional fields solution or renane this property

const defaultObj = {
    required: false,
    type: 'string'
};

function getArrayOfObj(propObj, fieldsReq) {
    const mergeIntoDefaultObj = (obj) => R.mergeRight(R.clone(defaultObj), obj);
    let newArray = [];
    R.forEachObjIndexed(function (key) {
        let newObj = mergeIntoDefaultObj(propObj[key]);
        newObj['property'] = key;
        if (fieldsReq.includes(key)) {
            newObj['required'] = true;
        }
        newArray.push(newObj);
    }, R.keys(propObj));
    return newArray;
};

function newFormValues (v) {
    let newValues = v.map(function(val, i) {
        switch (val) {
            case "":
                return null;
                break;
            case "null":
                return null;
                break;
            case "Null":
                return null;
                break;
            case "NULL":
                return null;
                break;
            case "true":
                return true;
                break;
            case "True":
                return true;
                break;
            case "TRUE":
                return true;
                break;
            case "false":
                return false;
                break;
            case "False":
                return false;
                break;
            case "FALSE":
                return false;
                break;
            default:
                return val;
        }
    });
    return newValues
};

router.get("/", async (req, res) => {
    res.render("login")
});

router.get("/endpoints", async (req, res) => {
    let wantedList = await urls.EndpointList();
    res.render("homepage",{layout:"endpoints", wantedList });
});

router.get("/endpoints/:name", async (req, res) => {
    //send back data on the crud operations
    let endpointName = req.params.name
});

router.get("/roles/post", async (req, res) => {
    let role = await rolesJson.getRolesData();
    let fieldsRequired = role.required;
    let fieldObject = role.properties;

    let newFieldObjectArray = getArrayOfObj(fieldObject, fieldsRequired);

    const allFieldsPlusArray = [newFieldObjectArray, ...optionalFields];
    allFields = [].concat(...allFieldsPlusArray);
    console.log(allFields);

    

    res.render("roles-post", { allFields });
});

router.get("/endpoints/Roles/post",  async (req, res) => {
    res.redirect("/endpoints/roles/post")
})

router.post("/endpoints/roles/post", async (req, res) => {
    let values = req.body.fields;
    let newValues = newFormValues(values);
    console.log("THESE ARE THE VALUES")
    console.log(values)
    console.log(newValues)
    console.log(allFields);
    let domain = req.body.domain;
    const allFieldsKeys = [];
    allFields.forEach(objKey => allFieldsKeys.push(objKey.property));
    call = allFieldsKeys.reduce((accumulator, current, i) => ({ ...accumulator, [current]: newValues[i] }), {});
    try {
        let response = await axios.post(
            `https://${domain}.mvretail.com/ExternalAPIController/role`,
            {
                "Type": "Role",
                "Data": call
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "version": "2.0.0"
                }
            })
        let payload = response.data
        console.log(payload);
        res.render("roles-post", {layout:"endpoints", wantedList, allFields, payload: JSON.stringify(payload.data) });
    } catch (error) {
        let { code, port } = error
        console.log({ error });
        res.render("roles-post", { layout:"endpoints", wantedList, error});
    }
});

router.get("/roles/get", async (req, res) => {
    res.render("roles-get")
});

router.post("/roles/get", async (req, res) => {
    let ID = req.body.ID;
    let domain = req.body.domain;
    let IDType = req.body.IDType
    console.log(ID);
    console.log(domain);
    try {
        let response = await axios.get(
            `https://${domain}.mvretail.com/ExternalAPIController/role/${ID}`,
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "version": "2.0.0",
                    "x-id-type": `${IDType}`
                }
            });
        let payload = response.data
        console.log(payload);
        res.render("roles-get", { allFields, payload: JSON.stringify(payload.data) });
    } catch (error) {
        let { code, port } = error
        console.log({ error });
        res.render("roles-get", { error });
    };
});

router.get("/roles/delete", async (req, res) => {
    res.render("roles-delete")
});

router.post("/roles/delete", async (req, res) => {
    let ID = req.body.ID;
    let domain = req.body.domain;
    let IDType = req.body.IDType
    console.log(ID);
    console.log(domain);
    try {
        let response = await axios.delete(
            `https://${domain}.mvretail.com/ExternalAPIController/role/${ID}`,
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "version": "2.0.0",
                    "x-id-type": `${IDType}`
                }
            });
        let payload = response.status
        console.log(payload);
        if (payload === 204) {
            payload = `The Role with the ID ${ID} Has been Deleted`
        };
        res.render("roles-delete", { allFields, payload: JSON.stringify(payload) });
    } catch (error) {
        let { code, port } = error
        console.log({ error });
        res.render("roles-delete", { error });
    };
});


router.get("/mPlan/post", async (req, res) => {
    let mPlan = await mPlanJson.getMPlanData();
    let fieldsRequired = mPlan.required;
    let fieldObject = mPlan.properties;

    let newFieldObjectArray = getArrayOfObj(fieldObject, fieldsRequired);

    const allFieldsPlusArray = [newFieldObjectArray, ...optionalFields];
    allFields = [].concat(...allFieldsPlusArray);
    console.log(allFields);

    res.render("mPlan-post", { allFields });
});

router.post("/mPlan/post", async (req, res) => {
    let values = req.body.fields;
    let newValues = newFormValues(values);
    let domain = req.body.domain;
    const allFieldsKeys = [];
    console.log(allFields)
    allFields.forEach(objKey => allFieldsKeys.push(objKey.property));
    call = allFieldsKeys.reduce((accumulator, current, i) => ({ ...accumulator, [current]: newValues[i] }), {});
    try {
        let response = await axios.post(
            `https://${domain}.mvretail.com/ExternalAPIController/mplan`,
            {
                "Type": "mPlan",
                "Data": call
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "version": "2.0.0"
                }
            })
        let payload = response.data
        console.log(payload);
        res.render("roles-post", { allFields, payload: JSON.stringify(payload.data) });
    } catch (error) {
        let { code, port } = error
        console.log({ error });
        res.render("mPlan-post", { error });
    }
});


module.exports = router;