'use strict'

//Importaciones
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import userRoutes from '../src/user/user.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js' 
import categoryRoutes from '../src/category/category.routes.js'

const app = express()
config();
const port = process.env.PORT || 4656

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use(userRoutes)
app.use(publicationRoutes)
app.use(commentRoutes)
app.use(categoryRoutes)

export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}