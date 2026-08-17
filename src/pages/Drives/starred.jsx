import '../../layouts/layouts.css'
import Menu from '../../components/MenuFile';
import MenuFolder from '../../components/MenuFolder';
import { useEffect, useState, useRef } from 'react';
import { useFiles } from '../../hooks/useFiles';
import { useFolders } from '../../hooks/useFolders';
import { downloadFile } from '../../services/downloadService';
import BreadCrump from '../../components/Breadcrump';
import SharePage from '../../components/share-page';

function Starred({
    setType,
    pages,
    setPages,
    showPreview,
    showMenu,
    setShowMenu,
    listStarred,
    setListStar,
    listStarredFolders,
    setListStarFolder,
    showNotice,
    setShowNotice,
    listTrashed,
    setListTrash,
    listTrashedFolders,
    setListTrashFolder,
    setFolders,
    setNotice,
    highlightFileId,
    setHighlightFileId,
    setPaths,
    setChoice,
    cacheURL,
    setPreview,
    Share,
    setShare,
    ShareProgress,
    setShareProgress,
    setListShare
}) {
    const { Load_Starred_File, getURL } = useFiles();
    const { Load_Starred_Folder } = useFolders();
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const fileRefs = useRef({});
    useEffect(() => {
        async function Load_Stars_File() {
            const response = await Load_Starred_File();
            if (response.Type === "Token expired") {
                setType("login");
                return;
            }
            if (response.Type === "Star") {
                if (response.Error) {
                    console.log(response.Message);
                    return
                }
                setListStar(response.List_files ?? []);            
            }
        }
        Load_Stars_File();
    }, []);

    useEffect(() => {
        async function Load_Stars_Folder() {
            const response = await Load_Starred_Folder();
            if (response.Type === "Token expired") {
                setType("login");
                return;
            }
            if (response.Type === "Star") {
                if (response.Error) {
                    console.log(response.Message);
                    return
                }
                setListStarFolder(response.List_folders ?? []);
            }
        }
        Load_Stars_Folder();
    }, []);

    useEffect(() => {
        if (!highlightFileId) return;
        const el = fileRefs.current[highlightFileId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        const timer = setTimeout(() => {
            setHighlightFileId(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [highlightFileId, setHighlightFileId]);
    return (
        <div
            className='starred-page'
            onClick={() => setShowNotice(false)}
            style={{
                gridColumn: showPreview || showNotice ? "2/3" : "2/4",
                zIndex: pages === "Star" ? 30 : -30,
                pointerEvents: pages === "Star" ? "auto" : "none",
                opacity: pages === "Star" ? 1 : 0,
            }}
        >
            <SharePage
                Share={Share}
                ShareProgress={ShareProgress}
                setShare={setShare}
                setShareProgress={setShareProgress}
                setType={setType}
                setListShare={setListShare}
            />
            <p>Folder starred</p>
            <div className='list-star-folder' style={{justifyContent: listStarredFolders?.length === 0 ? "center" : "flex-start"}}>
                {listStarredFolders?.length === 0 ? (
                    "No folder marked"
                ) : (
                    listStarredFolders?.map((folder) => (
                        <div
                            key={folder?.Folder_id}
                            title={folder?.Name_Folder}
                            ref={(el) => {
                                if (el) fileRefs.current[folder?.Folder_id] = el;
                            }}
                            onClick={() => {
                                setPaths((prev) => [...prev, folder]);
                                setPages("MyDrive");
                                setChoice("home");
                            }}
                            className={`folder ${highlightFileId === folder?.Folder_id ? 'highlight-file' : ''}`}
                        >
                            <span className="folder-name"><span>&#11088;</span>{folder?.Name_Folder}</span>
                            <div className='optionFile' onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPos({ top: rect.bottom, right: window.innerWidth - rect.right });
                                setShowMenu(folder?.Folder_id);
                            }}>
                                &#8801;
                                <MenuFolder
                                    showMenu={showMenu === folder?.Folder_id}
                                    position={menuPos}
                                    Type_Menu="Star"
                                    each_folder={folder}
                                    listStarredFolders={listStarredFolders}
                                    setListStarFolder={setListStarFolder}
                                    listTrashedFolders={listTrashedFolders}
                                    setListTrashFolder={setListTrashFolder}
                                    setFolders={setFolders}
                                    setType={setType}
                                    setNotice={setNotice}
                                    setShareProgress={setShareProgress}
                                    setShare={setShare}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <p>File starred</p>
            <hr />
            <div className='list-star'>
                {listStarred.length === 0 ? (
                    "No file marked"
                ) : (
                    listStarred.map((file) => (
                        <div 
                        key={file?.File_id} 
                        title={file?.Name}
                        className='one_file'
                        onClick={async () => {
                                const MimeType = file?.MimeType;
                                const isPreviewable =
                                    MimeType?.startsWith("image/") ||
                                    MimeType === "application/pdf" ||
                                    MimeType?.startsWith("video/") ||
                                    MimeType?.startsWith("audio/");

                                if (cacheURL.current[file.File_id] && cacheURL.current[file.File_id].expired > Date.now()) {
                                    if (isPreviewable) {
                                        setPreview({ ...file, URL: cacheURL.current[file.File_id].url });
                                        return;
                                    } else {
                                        return;
                                    }
                                }

                                const response = await getURL(file?.File_id);
                                if (response.Error && response.Type === "Token expired") {
                                    setType("login");
                                    return;
                                }
                                setPreview({ ...file, URL: response.URL });
                                cacheURL.current[file.File_id] = {
                                    url: response.URL,
                                    expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                };

                                if (!isPreviewable) {
                                    return;
                                }
                            }}
                            onDoubleClick={async () => {
                                const MimeType = file?.MimeType;
                                const isPreviewable =
                                    MimeType?.startsWith("image/") ||
                                    MimeType === "application/pdf" ||
                                    MimeType?.startsWith("video/") ||
                                    MimeType?.startsWith("audio/");

                                if (cacheURL.current[file.File_id] && cacheURL.current[file.File_id].expired > Date.now()) {
                                    if (isPreviewable) {
                                        window.open(cacheURL.current[file.File_id].url);
                                        return;
                                    } else {
                                        const confirm_download = confirm("Download this file?");
                                        if (confirm_download) {
                                            downloadFile(cacheURL.current[file.File_id].url, file.Name);
                                            return;
                                        }
                                        return;
                                    }
                                }
                                const response = await getURL(file?.File_id);
                                if (response.Error && response.Type === "Token expired") {
                                    setType("login");
                                    return;
                                }

                                window.open(cacheURL.current[file.File_id].url);
                                cacheURL.current[file.File_id] = {
                                    url: response.URL,
                                    expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                };
                                if (!isPreviewable) {
                                    const confirm_download = confirm("Download this file?");
                                    if (confirm_download) {
                                        downloadFile(cacheURL.current[file.File_id].url, file.Name);
                                        return;
                                    }
                                    return;
                                }
                            }}
                        >
                            <div
                                ref={(el) => {
                                    if (el) fileRefs.current[file?.File_id] = el;
                                }}
                                className={`file ${highlightFileId === file?.File_id ? 'highlight-file' : ''}`}
                            >
                                <span>&#11088;</span>{file?.Name}
                            </div>
                            <div className='optionFile' onClick={() => setShowMenu(file?.File_id)}>
                                &#8801;
                                <Menu
                                    showMenu={showMenu === file?.File_id}
                                    Type_Menu="Star"
                                    each_files={file}
                                    listStarred={listStarred}
                                    setListStar={setListStar}
                                    listTrashed={listTrashed}
                                    setListTrash={setListTrash}
                                    setType={setType}
                                    setNotice={setNotice}
                                    setShareProgress={setShareProgress}
                                    setShare={setShare}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Starred