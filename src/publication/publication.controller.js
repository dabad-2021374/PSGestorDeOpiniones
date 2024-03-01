'use strict'

import Publication from './publication.model.js'
import Category from '../category/category.model.js'
import Comment from '../comment/comment.model.js'
import { checkUpdate } from '../utils/validator.js'

export let testP = (req, res) => {
    return res.send({ message: 'Function test is running | publication' })
}

export let savePubli = async (req, res) => {
    try {
        let data = req.body
        data.user = req.user._id

        //Si la categoria no existe
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })

        let publication = new Publication(data)
        await publication.save()

        return res.send({ message: 'Publication saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving publication' })
    }
}

export let updatePubli = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, false)
        let userToken = req.user._id.toString()

        let publication = await Publication.findOne({ _id: id })
        if (!publication) return res.status(404).send({ message: 'Publication not found' })

        //Compara si el usuario que esta enviando la solicitud es el mismo del comentario
        if (publication.user.toString() !== userToken) return res.status(403).send({ message: 'Unauthorized to delete this publication' })

        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatePublication = await Publication.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category', ['name', 'description'])
        if (!updatePublication) return res.status(404).send({ message: 'Publi not found and not updated' })
        return res.send({ message: 'Publication updated successfully', updatePublication })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating publication' })
    }
}

export let deletePubli = async (req, res) => {
    try {
        let { id } = req.params
        let userToken = req.user._id.toString()

        let publication = await Publication.findOne({ _id: id })
        if (!publication) return res.status(404).send({ message: 'Publication not found' })
 
        //Compara si el usuario que esta enviando la solicitud es el mismo de la publicacion
        if (publication.user.toString() !== userToken) return res.status(403).send({ message: 'Unauthorized to delete this publication' })

        //eliminar comentarios de esta publicacion
        await Comment.deleteMany({ publication: id });

        let deletedPubli = await Publication.deleteOne({ _id: id })
        if (deletedPubli.deletedCount === 0) return res.status(404).send({ message: 'Publication not found and not deleted' })
        return res.send({ message: 'Deleted publication successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting publication' })
    }
}

export const getPublicationsAndComents = async (req, res) => {
    try {
        let publications = await Publication.find();
        let publicationsWithComments = [];

        for (let publication of publications) {
            let comments = await Comment.find({ publication: publication._id });
            publicationsWithComments.push({ publication, comments });
        }
        return res.send({ publicationsWithComments });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching publications with comments', err: err });
    }
}


export const getPublicationAndComents = async (req, res) => {
    try {
        let { id } = req.params;
        let publication = await Publication.findById(id);
        if (!publication) return res.status(404).send({ message: 'Publication not found' })
        let comments = await Comment.find({ publication: id });
        return res.send({ publication, comments });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching publication and comments', err: err });
    }
}



