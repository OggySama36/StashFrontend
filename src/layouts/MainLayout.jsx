import './layouts.css'
import SideBar from './SideBar'
import Header from './Header'
import Preview from '../pages/Preview/FilePreview'
import Notifications from '../components/Notification'
import Home from '../pages/Drives/home'
import Shared from '../pages/Drives/share'
import Starred from '../pages/Drives/starred'
import Trashed from '../pages/Drives/trash'
import Profile from '../pages/Profile/profile'
import { useRef, useState } from 'react'

function MainLayout({ 
    type, setType, 
    Me, setMe,
    NameUser, setName, 
    joinedDate, setJoin,
    avatarUrl, setAvatar,
    theme, setTheme

}){
    const [showPreview, setShow] = useState(true);
    const [paths, setPaths] = useState([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
    const [choice, setChoice] = useState("home");
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [isSaving, setSaving] = useState(false);
    const [profile, setGoToProfile] = useState(false);
    const [ShareProgress, setShareProgress] = useState("default");
    const [used, setUsed] = useState(null);
    const [left, setLeft] = useState(null);
    const [isLoading, setLoading] = useState(0);
    const [pages, setPages] = useState("MyDrive");
    const [listShared, setListShare] = useState([]);
    const [listStarred, setListStar] = useState([]);
    const [listTrashed, setListTrash] = useState([]);
    const [notifications, setNotice] = useState([]);
    const [listStarredFolders, setListStarFolder] = useState([]);
    const [listTrashedFolders, setListTrashFolder] = useState([]);
    const [showNotice, setShowNotice] = useState(false);
    const [Share, setShare] = useState(null);
    const [listFind, setFind] = useState([]);
    const [highlightFileId, setHighlightFileId] = useState(null);
    const [valueSearch, setValueSearch] = useState("");
    const cacheURL = useRef({})
    return (
        <>
            <div className="dashboard"
            style={{
                opacity: type === "main" ? 1 : 0,
                pointerEvents: type === "main" ? "auto" : "none",
                zIndex: type === "main" ? 20 : -20,
            }}
            >
                <SideBar
                    pages={pages} setPages={setPages}
                    setType={setType}
                    paths={paths} setPaths={setPaths}
                    setFiles={setFiles}
                    setLoading={setLoading}
                    setProgress={setProgress}
                    left={left} setLeft={setLeft}
                    used={used} setUsed={setUsed}
                    setSaving={setSaving}
                    setNotice={setNotice}
                    setValueSearch={setValueSearch}
                    setFind={setFind}
                    choice={choice} setChoice={setChoice}
                />
                <Header
                    pages={pages}
                    setType={setType}
                    showPreview={showPreview}
                    setShow={setShow}
                    setShowNotice={setShowNotice}
                    listFind={listFind} setFind={setFind}
                    setPaths={setPaths}
                    setHighlightFileId={setHighlightFileId}
                    listStarred={listStarred}
                    listStarredFolders={listStarredFolders}
                    listTrashed={listTrashed}
                    listTrashedFolders={listTrashedFolders}
                    valueSearch={valueSearch} setValueSearch={setValueSearch}
                    setGoToProfile={setGoToProfile}
                    Me={Me}
                    avatarUrl={avatarUrl}
                />

                <Home
                    pages={pages}
                    setType={setType}
                    progress={progress} setProgress={setProgress}
                    isLoading={isLoading} setLoading={setLoading}
                    showPreview={showPreview}
                    paths={paths} setPaths={setPaths}
                    files={files} setFiles={setFiles}
                    folders={folders} setFolders={setFolders}
                    preview={preview} setPreview={setPreview}
                    cacheURL={cacheURL}
                    showNotice={showNotice} setShowNotice={setShowNotice}
                    setListShare={setListShare}
                    listStarred={listStarred} setListStar={setListStar}
                    listTrashed={listTrashed} setListTrash={setListTrash}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    setLeft={setLeft}
                    setUsed={setUsed}
                    ShareProgress={ShareProgress} setShareProgress={setShareProgress}
                    Share={Share} setShare={setShare}
                    isSaving={isSaving} setSaving={setSaving}
                    setNotice={setNotice}
                    listStarredFolders={listStarredFolders}
                    setListStarFolder={setListStarFolder}
                    listTrashedFolders={listTrashedFolders}
                    setListTrashFolder={setListTrashFolder}
                    highlightFileId={highlightFileId} setHighlightFileId={setHighlightFileId}
                />
                <Shared
                    pages={pages}
                    Me={Me}
                    setPreview={setPreview}
                    showPreview={showPreview}
                    listShared={listShared} setListShare={setListShare}
                    showNotice={showNotice} setShowNotice={setShowNotice}
                    ShareProgress={ShareProgress} setShareProgress={setShareProgress}
                    Share={Share} setShare={setShare}
                    cacheURL={cacheURL}
                    valueSearch={valueSearch}
                />
                <Starred
                    pages={pages} setPages={setPages}
                    setPaths={setPaths}
                    setChoice={setChoice}
                    showPreview={showPreview}
                    setListShare={setListShare}
                    listStarred={listStarred} setListStar={setListStar}
                    listTrashed={listTrashed} setListTrash={setListTrash}
                    showNotice={showNotice} setShowNotice={setShowNotice}
                    showMenu={showMenu} setShowMenu={setShowMenu}
                    Share={Share} setShare={setShare}
                    ShareProgress={ShareProgress} setShareProgress={setShareProgress}
                    setType={setType}
                    setNotice={setNotice}
                    cacheURL={cacheURL}
                    setPreview={setPreview}
                    listStarredFolders={listStarredFolders} setListStarFolder={setListStarFolder}
                    listTrashedFolders={listTrashedFolders} setListTrashFolder={setListTrashFolder}
                    highlightFileId={highlightFileId} setHighlightFileId={setHighlightFileId}
                />
                <Trashed
                    pages={pages}
                    paths={paths} setPaths={setPaths}
                    showPreview={showPreview}
                    listTrashed={listTrashed} setListTrash={setListTrash}
                    listStarred={listStarred} setListStar={setListStar}
                    showNotice={showNotice} setShowNotice={setShowNotice}
                    showMenu={showMenu} setShowMenu={setShowMenu}
                    setFiles={setFiles}
                    setLeft={setLeft}
                    setUsed={setUsed}
                    setType={setType}
                    cacheURL={cacheURL}
                    setNotice={setNotice}
                    setFolders={setFolders}
                    setPreview={setPreview}
                    listStarredFolders={listStarredFolders} setListStarFolder={setListStarFolder}
                    listTrashedFolders={listTrashedFolders} setListTrashFolder={setListTrashFolder}
                    highlightFileId={highlightFileId} setHighlightFileId={setHighlightFileId}
                />

                <Preview
                    showPreview={showPreview}
                    preview={preview} setPreview={setPreview}
                    showNotice={showNotice}
                />
                <Notifications
                    notifications={notifications}
                    setNotice={setNotice} showNotice={showNotice}
                    setShowNotice={setShowNotice}
                />
                <Profile 
                    setType={setType}
                    profile={profile}
                    setGoToProfile={setGoToProfile}
                    used={used}
                    left={left}
                    foldersCount={folders}
                    filesCount={files}
                    starredCount={listStarred}
                    trashCount={listTrashed}
                    Me={Me} setMe={setMe}
                    NameUser={NameUser} setName={setName}
                    joinedDate={joinedDate} setJoin={setJoin}
                    avatarUrl={avatarUrl} setAvatar={setAvatar}
                    theme={theme} setTheme={setTheme}
                />
            </div>
        </>
    )
}

export default MainLayout