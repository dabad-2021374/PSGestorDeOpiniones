'use strict'

import {Schema, model } from 'mongoose'

const commentSchema = Schema({
    comment: {
        type: String,
        required: true
    },
    publication: {
        type: Schema.ObjectId,
        ref: 'publication',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    versionKey: false
})

export default model('comment', commentSchema)