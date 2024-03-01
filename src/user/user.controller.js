'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const registerUser = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'USER'
        data.phone = `+502 ${req.body.phone}`;
        let user = new User(data)
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const user = await User.findOne({ 
            $or: [{ username }, { email }] 
        })
        if (!user) {
            return res.status(404).send({ message: 'Invalid username or email' })
        }
        if (await checkPassword(password, user.password)) {
            const loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name
            }

            const token = await generateJwt(loggedUser)
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token })
        }

        return res.status(401).send({ message: 'Invalid password' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error logging in', error })
    }
}

export const updateUser = async(req, res)=>{ 
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const updatePass = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;
        let user = await User.findOne({ username });

        //Solo el usuario puede actualizar su password
        if (req.user._id.toString() !== user._id.toString()) return res.status(403).send({ message: 'Unauthorized to update password for this user' })
        
        // Verificar si el usuario existe y si la contraseña antigua es valida
        if (user && await checkPassword(oldPassword, user.password)) {
            const encryptedNewPassword = await encrypt(newPassword);
            user.password = encryptedNewPassword;
            await user.save();
            return res.send({ message: 'Password updated successfully' });
        }
        return res.status(400).send({ message: 'Invalid username or old password' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating password' });
    }
}
