'use strict'

import Comment from './comment.model.js'
import Publication from '../publication/publication.model.js'
import { checkUpdate } from '../utils/validator.js'

export const testCom = (req, res)=>{
    return res.send({message: 'Function test is running | comment'})
}

export const saveComment = async (req, res) => {
    try {
        let data = req.body
        data.user = req.user._id

        //Si la publicacion no existe
        let publication = await Publication.findOne({ _id: data.publication })
        if (!publication) return res.status(404).send({ message: 'Publication not found' })

        let comment = new Comment(data)
        await comment.save()

        return res.send({ message: 'Comment saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving comment' })
    }
}

export const updateComment = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let userToken = req.user._id.toString() //Obtener id-user del token
        let update = checkUpdate(data, false)

        //Si el comentario no existe
        let comment = await Comment.findOne({ _id: id })
        if (!comment) return res.status(404).send({ message: 'Comment not found' })

        //Compara si el usuario que esta enviando la solicitud es el mismo del commentario
        if (comment.user.toString() !== userToken) return res.status(403).send({ message: 'Unauthorized to delete this comment' })

        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateComment = await Comment.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate([
            { path: 'user', select: ['name', 'username'] },
            { path: 'publication', select: ['title'] }
        ])
        if (!updateComment) return res.status(404).send({ message: 'Comment not found and not updated' })
        return res.send({ message: 'Comment updated successfully', updateComment })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating comment' })
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params
        let userToken = req.user._id.toString()

        let comment = await Comment.findOne({ _id: id })
        if (!comment) return res.status(404).send({ message: 'Comment not found' })

        //Compara si el usuario que esta enviando la solicitud es el mismo del comentario
        if (comment.user.toString() !== userToken) return res.status(403).send({ message: 'Unauthorized to delete this comment' })

        let updateComment = await Comment.deleteOne({ _id: id })
        if (updateComment.deletedCount === 0) return res.status(404).send({ message: 'Comment not found and not deleted' })
        return res.send({ message: 'Deleted comment successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting comment' })
    }
}
