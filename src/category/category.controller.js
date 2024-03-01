'user strict'

import Category from '../category/category.model.js'

export const testC = (req, res)=>{
    return res.send({message: 'Function test is running | category'})
}

export const saveCategory = async (req, res) => {
    try {
        let data = req.body

        let category = new Category(data)
        await category.save()

        return res.send({ message: 'Category saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving category' })
    }
}

export const getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        return res.send({categories});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching categories', err: err });
    }
}