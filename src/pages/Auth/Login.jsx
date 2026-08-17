import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';
import validate from '../../services/authServices'
import '../../layouts/layouts.css'
import './Auth.css'

function Login({ type, setType, lock, setLock, setMe, setName, setJoin, setAvatar, setTheme }) {
    const [showPassword, setShowPassword] = useState(false);
    const { login, ForgotPasswordSendCode, ForgotPasswordVerifyCode, ForgotPasswordResetPassword } = useAuth()
    const [viewMode, setViewMode] = useState("login");
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotSubmitting, setForgotSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
    const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordTouched, setNewPasswordTouched] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    function resetForgotFlow() {
        setViewMode("login");
        setForgotEmail("");
        setForgotError("");
        setResendCooldown(0);
        setCodeDigits(["", "", "", "", "", ""]);
        setNewPassword("");
        setNewPasswordTouched(false);
        setConfirmNewPassword("");
        setConfirmNewPasswordTouched(false);
    }

    async function handleSendForgotCode(e) {
        e?.preventDefault();
        if (!forgotEmail) {
            setForgotError("Please enter your email");
            return;
        }
        if (!validate.check_ValidEmail(forgotEmail)) {
            setForgotError("Invalid email address");
            return;
        }
        setForgotError("");
        setForgotSubmitting(true);
        const response = await ForgotPasswordSendCode(forgotEmail);
        setForgotSubmitting(false);
        if (response?.Error) {
            setForgotError(response.Message ?? "Failed to send code");
            return;
        }
        setViewMode("forgotCode");
        setResendCooldown(60);
        setTimeout(() => codeRefs[0]?.current?.focus(), 0);
    }

    async function handleResendForgotCode() {
        if (resendCooldown > 0) return;
        setForgotError("");
        setForgotSubmitting(true);
        const response = await ForgotPasswordSendCode(forgotEmail);
        setForgotSubmitting(false);
        if (response?.Error) {
            setForgotError(response.Message ?? "Failed to resend code");
            return;
        }
        setCodeDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        codeRefs[0]?.current?.focus();
    }

    function handleCodeChange(index, value) {
        if (!/^[0-9]?$/.test(value)) return;
        const next = [...codeDigits];
        next[index] = value;
        setCodeDigits(next);
        if (value && index < 5) {
            codeRefs[index + 1]?.current?.focus();
        }
    }

    function handleCodeKeyDown(index, e) {
        if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
            codeRefs[index - 1]?.current?.focus();
        }
        if (e.key === "Enter") {
            handleVerifyForgotCode();
        }
    }

    async function handleVerifyForgotCode(e) {
        e?.preventDefault();
        const code = codeDigits.join("");
        if (code.length < 6) {
            setForgotError("Please enter the full 6-digit code");
            return;
        }
        setForgotError("");
        setForgotSubmitting(true);
        const response = await ForgotPasswordVerifyCode(forgotEmail, code);
        setForgotSubmitting(false);
        if (response?.Error) {
            setForgotError(response.Message ?? "Invalid code");
            return;
        }
        setViewMode("forgotNewPassword");
    }

    const isNewPasswordValid = validate.check_ValidPassword(newPassword);
    const isConfirmNewPasswordValid = confirmNewPassword === newPassword;

    async function handleResetPassword(e) {
        e?.preventDefault();
        if (!newPassword || !confirmNewPassword) {
            setForgotError("Please fill in all fields");
            return;
        }
        if (!isNewPasswordValid) {
            setForgotError("Password must be at least 8 characters, with uppercase, lowercase, number and symbol");
            setNewPasswordTouched(true);
            return;
        }
        if (!isConfirmNewPasswordValid) {
            setForgotError("Passwords do not match");
            setConfirmNewPasswordTouched(true);
            return;
        }
        setForgotError("");
        setForgotSubmitting(true);
        const response = await ForgotPasswordResetPassword(forgotEmail, newPassword);
        setForgotSubmitting(false);
        if (response?.Error) {
            setForgotError(response.Message ?? "Failed to reset password");
            return;
        }
        alert("Password reset successfully! Please sign in with your new password.");
        resetForgotFlow();
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLock(true);
        const response = await login(
            document.getElementById('email').value,
            document.getElementById('password').value
        );
        if (!response.Error) {
            setType("main");
            setLock(false);
            setMe(response.Email);
            setName(response.Name);
            setJoin(response.JoinedDate);
            setAvatar(response.AvatarLink);
            setTheme(response.Theme);
            document.getElementById('email').value = "",
            document.getElementById('password').value = ""
        }
        else {
            alert(response.Message);
            setType("login")
            setLock(false);
        }
    }

    return (
        <div className='auth-login'
        style={{
            opacity: type === "login" ? 1 : 0,
            pointerEvents: type === "login" ? "auto" : "none",
            zIndex: type === "login" ? 10 : -10,
        }}
        >
            {viewMode === "login" && (
                <>
                    <h1 style={{marginBottom: "10px"}}>Sign in</h1>
                    <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" required />
                                <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                            </div>
                            <p
                                style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', marginTop: '8px', alignSelf: 'flex-end' }}
                                onClick={() => setViewMode("forgotEmail")}
                            >Forgot password?</p>
                        </div>
                        <div className="change-form">
                            <p>Don't have an account?</p><p style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }} onClick={() => setType("register")}>Register</p>
                        </div>
                        <div className="button-container">
                            <button disabled={lock} type="submit">
                                {lock ? <span className="btn-spinner"></span> : "Login"}
                            </button>
                        </div>
                    </form>
                </>
            )}

            {viewMode === "forgotEmail" && (
                <>
                    <h1 style={{marginBottom: "10px"}}>Forgot password</h1>
                    <form onSubmit={handleSendForgotCode} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className="form-group">
                            <label htmlFor="forgotEmail">Email</label>
                            <input
                                type="email"
                                id="forgotEmail"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                            />
                        </div>
                        {forgotError && <p className='changepassword-error'>{forgotError}</p>}
                        <div className="change-form">
                            <p style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }} onClick={resetForgotFlow}>Back to login</p>
                        </div>
                        <div className="button-container">
                            <button disabled={forgotSubmitting} type="submit">
                                {forgotSubmitting ? <span className="btn-spinner"></span> : "Send code"}
                            </button>
                        </div>
                    </form>
                </>
            )}

            {viewMode === "forgotCode" && (
                <>
                    <h1 style={{marginBottom: "10px"}}>Enter confirmation code</h1>
                    <p className='changeemail-subtext'>We sent a 6-digit code to {forgotEmail}</p>
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
                            <span className='changeemail-resend-link' onClick={handleResendForgotCode}>Resend code</span>
                        )}
                    </div>
                    {forgotError && <p className='changepassword-error'>{forgotError}</p>}
                    <div className="change-form">
                        <p style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }} onClick={resetForgotFlow}>Back to login</p>
                    </div>
                    <div className="button-container">
                        <button disabled={forgotSubmitting} onClick={handleVerifyForgotCode}>
                            {forgotSubmitting ? <span className="btn-spinner"></span> : "Verify"}
                        </button>
                    </div>
                </>
            )}

            {viewMode === "forgotNewPassword" && (
                <>
                    <h1 style={{marginBottom: "10px"}}>Set new password</h1>
                    <form onSubmit={handleResetPassword} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New password</label>
                            <div className="password-input">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setNewPasswordTouched(true); }}
                                    className={newPasswordTouched ? (isNewPasswordValid ? 'validPwd' : 'invalidPwd') : ''}
                                    required
                                />
                                <input type="checkbox" checked={showNewPassword} onChange={() => setShowNewPassword(!showNewPassword)} />
                            </div>
                            {newPasswordTouched && !isNewPasswordValid && (
                                <p className="field-error">Password must be at least 8 characters, with uppercase, lowercase, number and symbol</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword">Confirm new password</label>
                            <div className="password-input">
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    id="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => { setConfirmNewPassword(e.target.value); setConfirmNewPasswordTouched(true); }}
                                    className={confirmNewPasswordTouched ? (isConfirmNewPasswordValid ? 'validPwd' : 'invalidPwd') : ''}
                                    required
                                />
                                <input type="checkbox" checked={showConfirmNewPassword} onChange={() => setShowConfirmNewPassword(!showConfirmNewPassword)} />
                            </div>
                            {confirmNewPasswordTouched && !isConfirmNewPasswordValid && (
                                <p className="field-error">Passwords do not match</p>
                            )}
                        </div>
                        {forgotError && <p className='changepassword-error'>{forgotError}</p>}
                        <div className="button-container">
                            <button disabled={forgotSubmitting} type="submit">
                                {forgotSubmitting ? <span className="btn-spinner"></span> : "Reset password"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default Login