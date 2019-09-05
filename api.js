class APIModel {
  constructor(required = [], properties = {}) {
    this.required = required;
    this.properties = properties;
  }
}


module.exports = APIModel;