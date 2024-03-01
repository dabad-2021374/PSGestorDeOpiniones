'use strict'

import { Router } from 'express'
import { testCom, saveComment, deleteComment, updateComment } from './comment.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/testCom', [validateJwt, isAdmin], testCom)
api.post('/saveComment', [validateJwt], saveComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment)
api.put('/updateComment/:id', [validateJwt], updateComment)

export default api