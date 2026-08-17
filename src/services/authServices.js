import api from './api.js'
function check_ValidEmail(emailCheck){
    const checkCondition = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return checkCondition.test(emailCheck);
}
function check_ValidPassword(pwdCheck){
    const checkCondition = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return checkCondition.test(pwdCheck);
}

export default {
    check_ValidEmail,
    check_ValidPassword
}

export const loginHandler = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data
    } catch(error){
        return error.response.data
    }
};

export const registerHandler = async (username, email, password) => {
    try{
        const response = await api.post('/auth/register', { username, password, email });
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const logoutHandler = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const changeemail = async (email) => {
    try {
        const response = await api.post('/auth/change/email', { email });
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const verifyCodeEmail = async (vrfCode) => {
    try {
        const response = await api.post('/verify/code/email', { vrfCode });
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const changePwd = async (oldPwd, newPwd) => {
    try {
        const response = await api.post('/auth/change/password', { oldPwd, newPwd });
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const changeAvt = async (image) => {
    const formData =  new FormData();
    formData.append("file", image);
    const response = await api.post('/upload/avatar', formData);
    return response.data
}

export const changeTheme = async (theme) => {
    const response = await api.post(`/change/theme?theme=${theme}`);
    return response.data
}

export const deleteAccountHandler = async () => {
    const response = await api.delete("/delete/account");
    return response.data
}

export const forgotPwd = async (email) => {
    try {
        const response = await api.post('/auth/change/password/forgot', { email });
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const verifyForgotPwdCode = async (email, Otp) => {
    try {
        const response = await api.post('/verify/code/password/forgot', { email, Otp });
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const confirmNewPwd = async (email, NewPassword) => {
    try {
        const response = await api.post('/auth/reset/password/forgot', { email, NewPassword });
        return response.data
    } catch(error) {
        return error.response.data
    }
}