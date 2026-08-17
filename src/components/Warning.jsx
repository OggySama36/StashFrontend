import '../layouts/layouts.css'
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import validate from '../services/authServices'
import { Eye, EyeOff } from 'lucide-react'
function Warning({ setType, typeWarning, setTypeWarning, Me, setMe, setName, setJoin, setTheme }){
    const [oldPassword, setOldPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordTouched, setNewPasswordTouched] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { logout, ChangeEmail, VerifyCodeEmail, ChangePassword, deleteAccount } = useAuth();
    const [emailStep, setEmailStep] = useState("input");
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
    const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if(resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    function closeWarning(){
        setOldPassword("");
        setShowOldPassword(false);
        setNewPassword("");
        setNewPasswordTouched(false);
        setShowNewPassword(false);
        setConfirmPassword("");
        setConfirmPasswordTouched(false);
        setShowConfirmPassword(false);
        setFormError("");
        setEmailStep("input");
        setNewEmail("");
        setEmailError("");
        setCodeDigits(["", "", "", "", "", ""]);
        setResendCooldown(0);
        setTypeWarning("");
    }

    async function handleSubmitChangePassword(){
        if(!oldPassword || !newPassword || !confirmPassword){
            setFormError("Please fill in all fields");
            return;
        }
        if(oldPassword === newPassword) {
            setFormError("New password must be different from current password");
            return;
        }
        if(newPassword !== confirmPassword){
            setFormError("New passwords do not match");
            return;
        }
        if(!validate.check_ValidPassword(newPassword)){
            setFormError("New password must be at least 6 characters");
            return;
        }
        setIsSubmitting(true);
        const response = await ChangePassword(oldPassword, newPassword);
        setIsSubmitting(false);
        if(response?.Error){
            setFormError(response.Message ?? "Failed to change password");
            return;
        }
        if (response.Error && response.Type === "Token expired") {
            setType("login");
            return;
        }
        closeWarning();
    }

    async function SignOut() {
        setIsSubmitting(true);
        const response = await logout();
        setIsSubmitting(false);
        if (response.Error) {
            console.log(response.Message)
            return
        }
        setType("login");
        setMe("");
        setName("");
        setJoin("");
        setTheme("Default");
        return
    }

    async function handleSendCode(){
        if(!newEmail){
            setEmailError("Please enter a new email");
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)){
            setEmailError("Invalid email address");
            return;
        }
        if(newEmail === Me) {
            setEmailError("New email must be different with current email!");
            return
        }
        setEmailError("");
        setIsSubmitting(true);
        const response = await ChangeEmail(newEmail);
        if(response.Error){
            console.log(response.Message);
            setIsSubmitting(false);
            setEmailError(response.Message ?? "Failed to send code");
            return;
        }
        setIsSubmitting(false);
        setEmailStep("code");
        setResendCooldown(60);
        setTimeout(() => codeRefs[0]?.current?.focus(), 0);
    }

    async function handleResendCode(){
        if(resendCooldown > 0) return;
        setEmailError("");
        setIsSubmitting(true);
        const response = await ChangeEmail(newEmail);
        setIsSubmitting(false);
        if(response.Error){
            console.log(response.Message);
            setEmailError(response.Message ?? "Failed to resend code");
            return;
        }
        setCodeDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        codeRefs[0]?.current?.focus();
    }

    function handleCodeChange(index, value){
        if(!/^[0-9]?$/.test(value)) return;
        const next = [...codeDigits];
        next[index] = value;
        setCodeDigits(next);
        if(value && index < 5){
            codeRefs[index + 1]?.current?.focus();
        }
    }

    function handleCodeKeyDown(index, e){
        if(e.key === "Backspace" && !codeDigits[index] && index > 0){
            codeRefs[index - 1]?.current?.focus();
        }
    }

    async function handleVerifyCode(){
        const code = codeDigits.join("");
        if(code.length < 6){
            setEmailError("Please enter the full 6-digit code");
            return;
        }
        setEmailError("");
        setIsSubmitting(true);
        const response = await VerifyCodeEmail(code);
        if(response.Error){
            console.log(response.Message);
            setIsSubmitting(false);
            setEmailError(response.Message ?? "Invalid code");
            return;
        }
        setMe(newEmail);
        setIsSubmitting(false);
        closeWarning();
    }

    async function handleDeleteAccount(){
        setIsSubmitting(true);
        const response = await deleteAccount();
        if(response.Error){
            console.log(response.Message)
            return
        }
        setType("register");
        setIsSubmitting(false);
        closeWarning();
    }

    if(typeWarning === "signout"){
        return (
            <div className='warning-overlay'>
                <div className='signout-warning'>
                    <h2>Do you want to sign out?</h2>
                    <div className='handle-signout-btn'>
                        <button disabled={isSubmitting} onClick={closeWarning}>Cancel</button>
                        <button disabled={isSubmitting} onClick={SignOut}>{isSubmitting ? <span className="btn-spinner"></span> : "Sign out"}</button>
                    </div>
                </div>
            </div>
        )
    }

    if(typeWarning === "delete"){
        return (
            <div className='warning-overlay'>
                <div className='delete-warning'>
                    <h2>Do you want to delete this account?</h2>
                    <p>(Documents uploaded would be lost)</p>
                    <div className='handle-delete-btn'>
                        <button disabled={isSubmitting} onClick={closeWarning}>Cancel</button>
                        <button disabled={isSubmitting} onClick={handleDeleteAccount}>{isSubmitting ? <span className="btn-spinner"></span> : "Delete Account"}</button>
                    </div>
                </div>
            </div>
        )
    }

    if(typeWarning === "changeemail"){
        if(emailStep === "input"){
            return (
                <div className='warning-overlay'>
                    <div className='changepassword-warning'>
                        <h2>Change email</h2>
                        <div className='changepassword-fields'>
                            <div className='changepassword-input-wrap'>
                                <input
                                    type='email'
                                    placeholder='New email'
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyDown={(e) => { if(e.key === "Enter") handleSendCode(); }}
                                />
                            </div>
                        </div>
                        {emailError && <p className='changepassword-error'>{emailError}</p>}
                        <div className='handle-signout-btn'>
                            <button disabled={isSubmitting} onClick={closeWarning}>Cancel</button>
                            <button disabled={isSubmitting} onClick={handleSendCode}>{isSubmitting ? <span className="btn-spinner"></span> : "Send code"}</button>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className='warning-overlay'>
                <div className='changepassword-warning'>
                    <h2>Enter confirmation code</h2>
                    <p className='changeemail-subtext'>We sent a 6-digit code to {newEmail}</p>
                    <div className='changeemail-code-wrap'>
                        {codeDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={codeRefs[index]}
                                type='text'
                                inputMode='numeric'
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                className='changeemail-code-input'
                            />
                        ))}
                    </div>
                    <div className='changeemail-resend'>
                        {resendCooldown > 0 ? (
                            <span>Resend code in {resendCooldown}s</span>
                        ) : (
                            <span className='changeemail-resend-link' onClick={handleResendCode}>Resend code</span>
                        )}
                    </div>
                    {emailError && <p className='changepassword-error'>{emailError}</p>}
                    <div className='handle-signout-btn'>
                        <button disabled={isSubmitting} onClick={closeWarning}>Cancel</button>
                        <button disabled={isSubmitting} onClick={handleVerifyCode}>{isSubmitting ? <span className="btn-spinner"></span> : "Verify"}</button>
                    </div>
                </div>
            </div>
        )
    }

    if(typeWarning === "changepassword"){
        return (
            <div className='warning-overlay'>
                <div className='changepassword-warning'>
                    <h2>Change password</h2>
                    <div className='changepassword-fields'>
                        <div className='changepassword-input-wrap'>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder='Current password'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            {showOldPassword ? (
                                <EyeOff size={16} onClick={() => setShowOldPassword(false)} />
                            ) : (
                                <Eye size={16} onClick={() => setShowOldPassword(true)} />
                            )}
                        </div>
                        <div className='changepassword-input-wrap'>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder='New password'
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setNewPasswordTouched(true);
                                }}
                                className={newPasswordTouched ? (validate.check_ValidPassword(newPassword) ? 'valid-pwd' : 'invalid-pwd') : ''}
                            />
                            {showNewPassword ? (
                                <EyeOff size={16} onClick={() => setShowNewPassword(false)} />
                            ) : (
                                <Eye size={16} onClick={() => setShowNewPassword(true)} />
                            )}
                        </div>
                        <div className='changepassword-input-wrap'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Confirm new password'
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordTouched(true);
                                }}
                                className={confirmPasswordTouched ? (confirmPassword === newPassword ? 'valid-pwd' : 'invalid-pwd') : ''}
                            />
                            {showConfirmPassword ? (
                                <EyeOff size={16} onClick={() => setShowConfirmPassword(false)} />
                            ) : (
                                <Eye size={16} onClick={() => setShowConfirmPassword(true)} />
                            )}
                        </div>
                    </div>
                    {formError && <p className='changepassword-error'>{formError}</p>}
                    <div className='handle-signout-btn'>
                        <button disabled={isSubmitting} onClick={closeWarning}>Cancel</button>
                        <button disabled={isSubmitting} onClick={handleSubmitChangePassword}>{isSubmitting ? <span className="btn-spinner"></span> : "Change password"}</button>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}

export default Warning