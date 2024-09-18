
const postUserSchema = {
    phone: {
        label: 'شماره همراه',
        type: 'string',
        trim: true,
        max: 11,
        min: 11,
    },
    username: {
        label: 'نام کاربری',
        type: 'string',
        trim: true,
        max: 16,
        min: 8,
    },
    password: {
        label: 'رمز عبور',
        type: 'string',
        trim: true,
        max: 16,
        min: 8,
    }
}

const updateUserSchema = {
    id: {
        label: 'آیدی',
        type: 'string',
    },
    name: {
        label: 'نام',
        type: 'string',
        trim: true,
        max: 20,
        min: 3,
        optional: true
    },
    email: {
        label: 'ایمیل',
        type: 'email',
        optional: true
    },
    address: {
        label: 'آدرس',
        type: "array",
        items: {
            type: 'string',
            trim: true
        },
        optional: true
    },
    phone: {
        label: 'شماره همراه',
        type: 'string',
        trim: true,
        max: 11,
        min: 11,
        optional: true
    },
    username: {
        label: 'نام کاربری',
        type: 'string',
        trim: true,
        max: 16,
        min: 8,
        optional: true
    },
    password: {
        label: 'رمز عبور',
        type: 'string',
        trim: true,
        max: 16,
        min: 8,
        optional: true
    }
}

module.exports = {
    postUserSchema,
    updateUserSchema
}