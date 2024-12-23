const UserService = require('../services/UserService')

const createUser = async  (req, res) =>{
    try{
        const { name, email, password, confirmPassword, phone } = req.body
        const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const isCheckEmail = regexEmail.test(email)
        if ( !name || !email || !password || !confirmPassword || !phone ){
            return res.status(400).json({
                status: "ERR" ,
                message: "The input is required"
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status: "ERR" ,
                message: "The input is email"
            })
        }else if(password !== confirmPassword){
            return res.status(400).json({
                status: "ERR" ,
                message: "The password is equal confirmPassword"
            })
        }
        const response = await UserService.createUser(req.body) 
        return res.status(200).json(response)
    }catch(e){
        console.error('Create user error:', e);
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }
}

const loginUser = async  (req, res) =>{
    try{
        console.log('Login request body:', req.body); // Debug log

        const { email, password } = req.body
        if (!email || !password){
            return res.status(400).json({
                status: "ERR" ,
                message: "Email và mật khẩu là bắt buộc"
            })
        }

        const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const isCheckEmail = regexEmail.test(email)
        if(!isCheckEmail){
            return res.status(400).json({
                status: "ERR" ,
                message: "Email không hợp lệ"
            })
        }

        const response = await UserService.loginUser(req.body) 
        console.log('Login response:', response); // Debug log
        return res.status(200).json(response)
    }catch(e){
        console.error('Login error:', e); // Debug log
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }
}

const updateUser = async  (req, res) =>{
    try{
        console.log('Update user request body:', req.body); // Debug log

        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(400).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.updateUser(userId, data) 
        console.log('Update user response:', response); // Debug log
        return res.status(200).json(response)
    }catch(e){
        console.error('Update user error:', e); // Debug log
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }
}

const deleteUser = async  (req, res) =>{
    try{
        console.log('Delete user request params:', req.params); // Debug log

        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.deleteUser(userId) 
        console.log('Delete user response:', response); // Debug log
        return res.status(200).json(response)
    }catch(e){
        console.error('Delete user error:', e); // Debug log
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }
}

const getAllUser = async  (req, res) =>{
    try{
        console.log('Get all users request'); // Debug log

        const response = await UserService.getAllUser()
        console.log('Get all users response:', response); // Debug log
        return res.status(200).json(response)
    }catch(e){
        console.error('Get all users error:', e); // Debug log
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }
}

const getDetailUser = async  (req, res) =>{
    try{
        console.log('Get detail user request params:', req.params); // Debug log

        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.getDetailUser(userId) 
        console.log('Get detail user response:', response); // Debug log
        return res.status(200).json(response)
    }catch(e){
        console.error('Get detail user error:', e); // Debug log
        return res.status(500).json({
            status: "ERR",
            message: e.message || 'Internal server error'
        })
    }   
}


module.exports = { 
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}