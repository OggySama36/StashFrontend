import './Auth.css'
import {useState} from 'react'
import validate from '../../services/authServices'
import { useAuth } from '../../hooks/useAuth';

function Register({ type, setType, lock, setLock, setMe, setName, setJoin, setAvatar, setTheme }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showCfrPwd, setShowCfrPwd] = useState(false);
    const [email, setEmail] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const isEmailValid = validate.check_ValidEmail(email);
    const isPasswordValid = validate.check_ValidPassword(password);
    const isConfirmValid = confirmPassword === password;

    async function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        if (!username) {
            alert("Please enter your username!");
            return;
        }
        if (!email) {
            alert("Please enter your email!");
            return;
        }
        if (!isEmailValid) {
            alert("Invalid email format!");
            setEmailTouched(true);
            return;
        }
        if (!password) {
            alert("Please enter your password!");
            return;
        }
        if (!isPasswordValid) {
            alert("Password must be at least 8 characters, with uppercase, lowercase, number and symbol!");
            setPasswordTouched(true);
            return;
        }
        if (!confirmPassword) {
            alert("Please confirm your password!");
            return;
        }
        if (!isConfirmValid) {
            alert("Passwords do not match!");
            setConfirmPasswordTouched(true);
            return;
        }
        setLock(true);
        setLoading(true);
        const response = await register(username, email, password);
        setLoading(false);
        if (!response.Error) {
            setType("main");
            setLock(false);
            setName(response.Name);
            setMe(response.Email);
            setJoin(response.JoinedDate);
            setAvatar(response.AvatarLink);
            setTheme(response.Theme);
            document.getElementById('username').value = "";
            setEmail("");
            setEmailTouched(false);
            setPassword("");
            setPasswordTouched(false);
            setConfirmPassword("");
            setConfirmPasswordTouched(false);
        } else {
            alert(response.Message);
            setType("register");
            setLock(false);
        }
    }

    return (
        <div className='auth-register'
            style={{
                opacity: type === "register" ? 1 : 0,
                pointerEvents: type === "register" ? "auto" : "none",
                zIndex: type === "register" ? 10 : -10,
            }}
        >
            <h1 style={{marginBottom: "10px"}}>Sign up</h1>
            <form onSubmit={handleRegister} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                    }}
                    className={emailTouched ? (isEmailValid ? "validPwd" : "invalidPwd") : ""}
                />
                {emailTouched && !isEmailValid && (
                    <p className="field-error">Invalid email format</p>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordTouched(true);
                        }}
                        className={passwordTouched ? (isPasswordValid ? "validPwd" : "invalidPwd") : ""}
                    />
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                </div>
                {passwordTouched && !isPasswordValid && (
                    <p className="field-error">Password must be at least 8 characters, with uppercase, lowercase, number and symbol</p>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input">
                    <input
                        type={showCfrPwd ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordTouched(true);
                        }}
                        className={confirmPasswordTouched ? (isConfirmValid ? "validPwd" : "invalidPwd") : ""}
                    />
                    <input type="checkbox" checked={showCfrPwd} onChange={() => setShowCfrPwd(!showCfrPwd)} />
                </div>
                {confirmPasswordTouched && !isConfirmValid && (
                    <p className="field-error">Passwords do not match</p>
                )}
            </div>
            <div className="change-form">
                <p>Already have an account?</p>
                <p style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
                    onClick={() => setType("login")}>Login</p>
            </div>
            <div className="button-container">
                <button disabled={lock || loading} type="submit">
                    {loading ? <span className="btn-spinner"></span> : "Register"}
                </button>
            </div>
            </form>
        </div>
    )
}

export default Register