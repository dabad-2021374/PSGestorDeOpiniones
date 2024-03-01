'use strict'

import { Router } from 'express'
import { testP, savePubli, deletePubli, updatePubli, getPublicationAndComents, getPublicationsAndComents } from './publication.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/testP', [validateJwt, isAdmin], testP)
api.post('/savePubli', [validateJwt], savePubli)
api.delete('/deletePubli/:id', [validateJwt], deletePubli)
api.put('/updatePubli/:id', [validateJwt], updatePubli)
api.get('/getPublications', [validateJwt], getPublicationsAndComents)
api.get('/getPublication/:id', getPublicationAndComents)

export default api