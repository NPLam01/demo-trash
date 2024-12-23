const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generalAccessToken, generalRefreshToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            console.log('Creating user:', { email, name }); // Debug log

            // Check if email exists
            const checkUser = await User.findOne({ email: email })
            if (checkUser !== null) {
                reject({
                    status: "ERR",
                    message: "Email đã tồn tại"
                })
                return;
            }
            
            // Hash password and create user
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email, 
                password: hash, 
                phone
            })

            console.log('User created:', createdUser._id); // Debug log

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: "Đăng ký thành công",
                    data: createdUser
                })
            } else {
                reject({
                    status: "ERR",
                    message: "Có lỗi khi tạo tài khoản"
                })
            }
        } catch (e) {
            console.error('Create user error:', e); // Debug log
            reject({
                status: "ERR",
                message: e.message || "Có lỗi khi tạo tài khoản"
            })
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise  ( async (resolve, reject) =>{
        const { email, password } = userLogin
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null){
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại"
                })
                return
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "Mật khẩu không đúng"
                })
                return
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                email: checkUser.email
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                email: checkUser.email
            })

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                data: checkUser,
                access_token,
                refresh_token
            })
        } catch(e){
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkUser = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkUser === null){
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại"
                })
            }           
            const updateUser = await User.findByIdAndUpdate (id, data, {new: true})
                resolve({
                status: "OK",
                message: "Cập nhật thành công",
                data: updateUser
            })  
        } catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkUser = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkUser === null){
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại"
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "Xóa thành công",
            })
        } catch(e){
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const allUser =  await User.find()
            resolve({
                status: "OK",
                message: "Lấy tất cả người dùng thành công",
                data: allUser
            })
        } catch(e){
            reject(e)
        }
    })
}

const getDetailUser = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const user = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (user === null){
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại"
                })
            }                                       
            resolve({
                status: "OK",
                message: "Lấy thông tin người dùng thành công",
                data: user
            })
        } catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}