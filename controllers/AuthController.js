import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { JWT_AT_EXPIRES_IN, JWT_RT_EXPIRES_IN, JWT_SECRET, SALT_ROUNDS } from "../config/config.js";
import { UserServices } from "../services/UserServices.js";
import { AppError } from "../utils/appError.js";
import { validatePartialSchema, validateSchema } from "../utils/validateSchema.js";
import { userSchema } from "../validations/userSchema.js";
import { successResponse } from '../utils/response.js';

export class AuthController{
    static async register(req,res){
        const result = validateSchema(userSchema,req.body)

        if(!result) throw new AppError(JSON.parse(result.error).map(error => error.path +': '+error.message))            

        const {password} = result.data
        const passwordHashed = await bcrypt.hash(password,SALT_ROUNDS)

        const newUser = await UserServices.createUser({
            ...result.data,
            password: passwordHashed
        })

        successResponse(res, newUser, 201)
    }

    static async login(req,res){
        const result = validatePartialSchema(userSchema,req.body)

        if(!result) throw new AppError(JSON.parse(result.error).map(error => error.path +': '+error.message))            

        const {name, email, password} = result.data
        let user = null

        //username validation
        if(name) {
            user = await UserServices.getUserByUsernameOrEmail(name)
        }else{
            user = await UserServices.getUserByUsernameOrEmail(email)
        }
        if (!user) throw new AppError('Username or email is incorrect')
        
        //password validation
        const isSamePassword = await bcrypt.compare(password,user.password)
        if(!isSamePassword) throw new AppError('Password is incorrect')

        //jwt access-token creation
        const access_token= jwt.sign({
            id: user._id,
            username: user.name,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: JWT_AT_EXPIRES_IN
        })

        //jwt refresh-token creation
        const refresh_token= jwt.sign({ 
            id: user._id,
            username: user.name,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: JWT_RT_EXPIRES_IN
        })

        //jwt sent by a cookie
        successResponse(res, {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
         200, 
         {
            access_token,
            accessCookieOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24,     // 1d
            },
            refresh_token,
            refreshCookieOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
            }
            })

    }

    static async logout (req, res) {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')

      successResponse(res, { message: 'Log out successfully' })
    }

    static async refresh (req, res) {
        const refresh_token = req.cookies.refresh_token
        if (!refresh_token) {
            throw new AppError('No refresh token provided',401)
        }

        if (!refreshToken) throw new AppError('Refresh token no encontrado', 401)

        let payload
        try {
            payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET)
        } catch (err) {
            throw new AppError('Refresh token inválido', 401)
        }

        const user = await UserServices.getUserById(payload.id)
        if (!user) throw new AppError('Usuario no encontrado', 401)

        successResponse(res, {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, 200, {
            access_token: newAccessToken,
            accessCookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24, // 15 min
            },   
        })                    
      }
    
      static async me (req, res) {
        const user = req.user
        if (user) return successResponse(res,user)
        throw new AppError('Not logged yet',400)
      }
}