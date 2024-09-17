
const Validator = require('fastest-validator');

const v = new Validator({
    haltOnFirstError: true,
    messages: {
        stringMin: "{field} نباید کمتر از {expected} حرف باشد",
        stringMax: "{field} نباید بیشتر از {expected} حرف باشد",
        required: "{field} الزامی میباشد"
    }
})

const validator = (input, schema) => v.validate(input, schema)

module.exports = {
    v,
    validator,
}