'use strict'

import { Schema, model } from 'mongoose'

const publicationSchema = Schema({
    title: {
        type: String,
        required: true
    },
    textMain: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        required: true
    },
}, {
    versionKey: false
})

export default model('publication', publicationSchema)