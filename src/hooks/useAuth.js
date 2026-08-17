import {loginHandler as loginApi, 
        registerHandler as registerApi, 
        logoutHandler as logoutApi, 
        deleteAccountHandler as deleteAccountApi, 
        changePwd,
        changeAvt,
        changeTheme,
        changeemail,
        verifyCodeEmail,
        forgotPwd,
        verifyForgotPwdCode,
        confirmNewPwd
    } from '../services/authServices';
import api from '../services/api';

const useAuth = () => {
    const checkAuth = async () => {
        try {
            const response = await api.post("/auth/checkAuth");
            return response.data
        } catch(error){
            return error.response.data
        }
    }
    const login = async (email, password) => {
        const response = await loginApi(email, password);
        return response
    }

    const register = async (username, email, password) => {
        const response = await registerApi(username, email, password);
        return response
    }
    
    const logout = async () => {
        const response = await logoutApi();
        return response
    }

    const deleteAccount = async () => {
        const response = await deleteAccountApi();
        return response
    }

    const ChangeEmail = async (email) => {
        const response = await changeemail(email)
        return response
    }

    const VerifyCodeEmail = async (vrfCode) => {
        const response = await verifyCodeEmail(vrfCode);
        return response
    }

    const ChangePassword = async (oldPwd, newPwd) => {
        const response = await changePwd(oldPwd, newPwd);
        return response
    }

    const ChangeAvatar = async (image) => {
        const response = await changeAvt(image);
        return response
    }

    const ChangeTheme = async (theme) => {
        const response = await changeTheme(theme);
        return response
    }

    const ForgotPasswordSendCode = async (email) => {
        const response = await forgotPwd(email);
        return response
    }

    const ForgotPasswordVerifyCode = async (email, Otp) => {
        const response = await verifyForgotPwdCode(email, Otp)
        return response
    }

    const ForgotPasswordResetPassword = async (email, NewPassword) => {
        const response = await confirmNewPwd(email, NewPassword);
        return response
    }

    return { login, register, logout, deleteAccount, checkAuth, ChangeEmail, VerifyCodeEmail, ChangePassword, ChangeAvatar, ChangeTheme, ForgotPasswordSendCode, ForgotPasswordVerifyCode, ForgotPasswordResetPassword };
}
export { useAuth };