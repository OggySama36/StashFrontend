import './layouts.css'
import { FileUp, Home, Share2, Star, Trash2 } from 'lucide-react'
import Icon from '../assets/image-icon.png'
import { useEffect, useRef } from 'react'
import { useUpload } from '../hooks/useUpload';
import { useFiles } from '../hooks/useFiles';
import { formatBytes } from '../utils/formatByte';

function SideBar({ 
    setType, 
    paths, 
    setPaths,
    setFiles, 
    setLoading, 
    setProgress, 
    pages,
    setPages, 
    left, 
    setLeft, 
    used, 
    setUsed, 
    setSaving, 
    setNotice,
    setValueSearch,
    setFind,
    choice,
    setChoice
}) {
    
    const fileRef = useRef(null);
    const { up_files } = useUpload();
    const { getStorage } = useFiles();
    const pageRef = useRef(pages);
    useEffect(() => {
        pageRef.current = pages;
    }, [pages])

    useEffect(() => {
        async function storage() {
            const response = await getStorage();
            if (!response.Error) {
                setUsed(response.Used);
                setLeft(response.Left);
                return;
            }
        }
        storage();
    }, []);
    function backToHome() {
        setPages("MyDrive");
        setChoice("home");
        setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
    }
    return (
        <div className='sidebar'>
            <input
                className="upload-input"
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={async (e) => {
                    const fileSize = e.target.files[0].size;
                    const file = e.target.files[0];
                    if (!file) { return; }
                    if (used + fileSize > 104857600) {
                        alert(`File is too large. You have only ${formatBytes(left)} left!`);
                        return;
                    }
                    if (pageRef.current !== "MyDrive") {
                        alert("You can only upload file in Main Dashboard!");
                        e.target.value = "";
                        setPages("MyDrive");
                        setChoice("home");
                        setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
                        return
                    }
                    function onProgress(percent) {
                        setProgress(true);
                        setLoading(percent);
                    }
                    const response = await up_files(file, paths[paths.length - 1]?.Folder_id, onProgress);
                    if (!response.Error) {
                        setNotice((prev) => [...prev, `Uploaded ${file.name} successfully!`]);
                        e.target.value = "";
                        setSaving(true);
                        setFiles((prev) => [...prev, response]);
                        setUsed((prev) => prev += fileSize);
                        setLeft((prev) => prev -= fileSize);
                        setTimeout(() => {
                            setProgress(false);
                            setLoading(0);
                            setSaving(false);
                        }, 1500)
                    } 
                    if (response.Error && response.Type === "Token expired") {
                        setType("login");
                        return;
                    } else {
                        setNotice((prev) => [...prev, `Uploaded ${file.name} failed!`]);
                        e.target.value = "";
                        if (response.Type === "Token expired") {
                            setType("login");
                            return;
                        }
                    }
                }}
            />

            <div className="logo">
                <img src={Icon} alt="icon" onClick={() => backToHome()}/>
                <h1 onClick={() => backToHome()}>Stash</h1>
            </div>

            <hr />

            <div className='content-sidebar'>
                <div className='uploadFile-Btn' onClick={() => fileRef.current.click()}>
                    <FileUp size={18} /><span className='item-label'>&nbsp;Upload file</span>
                </div>

                <div className='space'></div>

                <div className='menu-side'>
                    <div
                        className={`item home ${choice === "home" ? 'isChosen' : 'unChoice'}`}
                        onClick={() => {
                            setChoice("home");
                            setPages("MyDrive");
                            setValueSearch("");
                            setFind([]);
                            setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
                        }}
                    >
                        <Home size={18} /><span className='item-label'>&nbsp;My Drive</span>
                    </div>

                    <div
                        className={`item share ${choice === "share" ? 'isChosen' : 'unChoice'}`}
                        onClick={() => {
                            setChoice("share");
                            setPages("Share");
                            setValueSearch("");
                            setFind([]);
                            setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
                        }}
                    >
                        <Share2 size={18} /><span className='item-label'>&nbsp;Share with me</span>
                    </div>

                    <div
                        className={`item starred ${choice === "starred" ? 'isChosen' : 'unChoice'}`}
                        onClick={() => {
                            setChoice("starred");
                            setPages("Star");
                            setValueSearch("");
                            setFind([]);
                            setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}]);
                        }}
                    >
                        <Star size={18} /><span className='item-label'>&nbsp;Starred</span>
                    </div>

                    <div
                        className={`item trash ${choice === "trash" ? 'isChosen' : 'unChoice'}`}
                        onClick={() => {
                            setChoice("trash");
                            setPages("Trash");
                            setValueSearch("");
                            setFind([]);
                            setPaths([{"Name_Folder": "Removed bin", "Folder_id": "Root"}]);
                        }}
                    >
                        <Trash2 size={18} /><span className='item-label'>&nbsp;Removed Bin</span>
                    </div>
                </div>
            </div>

            <div className='storage-box'>
                <p>{formatBytes(used)} USED / {formatBytes(left)} LEFT</p>
                <div className='storage'>
                    <div
                        className='storage-progress'
                        style={{ width: `${(used / 104857600) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default SideBar