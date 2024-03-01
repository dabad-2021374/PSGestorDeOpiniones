'use strict'

import { Router } from 'express'
import { getCategories, saveCategory, testC } from './category.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/testC', [validateJwt, isAdmin], testC)
api.post('/saveCategory', [validateJwt], saveCategory)
api.get('/getCategories', [validateJwt, getCategories])

export default api