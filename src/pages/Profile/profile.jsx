import '../../layouts/layouts.css'
import Avatar from '../../components/Avatar'
import { ArrowLeft, ChevronRight, File, Folder, Star, Trash2, Camera } from 'lucide-react'
import Warning from '../../components/Warning';
import { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function Profile({
    profile,
    setGoToProfile,
    used,
    left,
    filesCount,
    foldersCount,
    starredCount,
    trashCount,
    theme,
    setTheme,
    Me,
    setMe,
    NameUser,
    setName,
    setType,
    joinedDate,
    setJoin,
    avatarUrl,
    setAvatar
}) {
    const totalSpace = (used ?? 0) + (left ?? 0);
    const usedPercent = totalSpace > 0 ? Math.min(100, (used / totalSpace) * 100) : 0;
    const [typeWarning, setTypeWarning] = useState("");
    const getDate = joinedDate.split("T")[0];
    const getTime =  joinedDate.split("T")[1].split(".")[0];
    const avatarRef = useRef(null);
    const { ChangeAvatar, ChangeTheme } = useAuth();

    async function changeTheme(valueTheme) {
        const response = await ChangeTheme(valueTheme);
        if (response.Error) {
            console.log(response.Message);
            return
        }
        setTheme(valueTheme);
        return
    }
    return (
        <div className='profile'
        style={{
            pointerEvents: profile ? "auto" : "none",
            opacity: profile ? 1 : 0,
            zIndex: profile ? 100 : -100,
        }}
        >
            <input 
                type='file'
                ref={avatarRef}
                style={{ display: 'none' }}
                onChange={async(e) => {
                    const file = e.target.files[0];
                    const fileExt = e.target.files[0].name.split(".").pop();
                    const allowedExt = ["jpg", "jpeg", "png", "webp"];
                    if (!allowedExt.includes(fileExt)) {
                        alert("Only JPG, JPEG, PNG, or WEBP image files are allowed!");
                        e.target.value = "";
                        return;
                    }
                    const response = await ChangeAvatar(file);
                    if(response.Error){
                        console.log(response.Message);
                        e.target.value = "";
                        return
                    }
                    setAvatar(response.AvatarLink);
                    e.target.value = "";
                }}
            />
            <Warning
                typeWarning={typeWarning}
                setTypeWarning={setTypeWarning}
                setType={setType}
                Me={Me}
                setMe={setMe}
                setName={setName}
                setJoin={setJoin}
                setTheme={setTheme}
            />
            <div className='profile-header'>
                <ArrowLeft size={20} onClick={() => {setGoToProfile(false)}} style={{ cursor: "pointer" }} />
                <p>Profile</p>
            </div>

            <div className='profile-account'>
                <div className='profile-avatar-wrap'>
                    <Avatar size={200} Me={Me} avatarUrl={avatarUrl}/>
                    <div className='profile-avatar-edit'>
                        <Camera size={14} onClick={() => avatarRef.current.click()}/>
                    </div>
                </div>
                <p className='profile-name'>{NameUser ?? "User"}</p>
                <p className='profile-email'>{Me ?? "Email"}</p>
                <div className='profile-storage'>
                    <div className='profile-storage-labels'>
                        <span>{((used ?? 0) / (1024 * 1024)).toFixed(2)} MB used</span>
                        <span>{((left ?? 0) / (1024 * 1024)).toFixed(2)} MB left</span>
                    </div>
                    <div className='profile-storage-track'>
                        <div className='profile-storage-fill' style={{ width: `${usedPercent}%` }} />
                    </div>
                </div>
            </div>

            <div className='profile-stats'>
                <div className='profile-stat-card'>
                    <File size={18} />
                    <p className='profile-stat-value'>{filesCount.length ?? 0}</p>
                    <p className='profile-stat-label'>Files</p>
                </div>
                <div className='profile-stat-card'>
                    <Folder size={18} />
                    <p className='profile-stat-value'>{foldersCount.length ?? 0}</p>
                    <p className='profile-stat-label'>Folders</p>
                </div>
                <div className='profile-stat-card'>
                    <Star size={18} />
                    <p className='profile-stat-value'>{starredCount.length ?? 0}</p>
                    <p className='profile-stat-label'>Starred</p>
                </div>
                <div className='profile-stat-card'>
                    <Trash2 size={18} />
                    <p className='profile-stat-value'>{trashCount.length ?? 0}</p>
                    <p className='profile-stat-label'>Trash</p>
                </div>
            </div>

            <div className='profile-settings'>
                <div className='profile-settings-row'>
                    <span>Joined</span>
                    <span className='profile-settings-value'>{(getTime ?? "-") + " - " + (getDate ?? "-")}</span>
                </div>
                <div className='profile-settings-row profile-settings-row-clickable' onClick={() => setTypeWarning("changeemail")}>
                    <span>Change email</span>
                    <ChevronRight size={16} />
                </div>
                <div className='profile-settings-row profile-settings-row-clickable' onClick={() => setTypeWarning("changepassword")}>
                    <span>Change password</span>
                    <ChevronRight size={16} />
                </div>
                <div className='profile-settings-row'>
                    <span>Theme</span>
                    <div className='profile-theme-toggle'>
                        <button
                            className={theme === "Default" || !theme ? "active" : ""}
                            onClick={() => changeTheme("Default")}
                        >Default</button>
                        <button
                            className={theme === "Dark" ? "active" : ""}
                            onClick={() => changeTheme("Dark")}
                        >Dark</button>
                        <button
                            className={theme === "Light" ? "active" : ""}
                            onClick={() => changeTheme("Light")}
                        >Light</button>
                    </div>
                </div>
            </div>

            <div className='profile-actions'>
                <button className='profile-signout-btn' onClick={() => {setTypeWarning("signout")}}>Sign out</button>
                <button className='profile-delete-btn' onClick={() => {setTypeWarning("delete")}}>Delete account</button>
            </div>
        </div>
    )
}

export default Profile