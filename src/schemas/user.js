
const addUser = {
    phone: {
        type: 'string',
        trim: true,
        max: 20,
        min: 3,
        messages: {
            required: required('نام محصول'),
            stringMax: strMinOrMax('نام محصول', 'بیشتر', 20),
            stringMin: strMinOrMax('نام محصول', 'کمتر', 3),
        }
    },
    username: {

    },
    password: {

    }
}


module.exports = {
    addUser
}