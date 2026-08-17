import '../../layouts/layouts.css'
import Menu from '../../components/MenuFile'
import MenuFolder from '../../components/MenuFolder'
import { useFiles } from '../../hooks/useFiles'
import { useFolders } from '../../hooks/useFolders'
import { useEffect, useState, useRef } from 'react';
import BreadCrump from '../../components/Breadcrump';
import { downloadFile } from '../../services/downloadService'

function Trashed({
    setType,
    pages,
    paths,
    setPaths,
    setFolders,
    showPreview,
    showMenu,
    setShowMenu,
    listTrashed,
    setListTrash,
    listTrashedFolders,
    setListTrashFolder,
    showNotice,
    setShowNotice,
    listStarred,
    setListStar,
    listStarredFolders,
    setListStarFolder,
    setFiles,
    setLeft,
    setUsed,
    setNotice,
    highlightFileId,
    setHighlightFileId,
    cacheURL,
    setPreview
}) {
    const { Load_Removed_File, getURL } = useFiles();
    const { Load_Removed_Folder } = useFolders();
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const fileRefs = useRef({});
    useEffect(() => {
        async function Load_trashes_File() {
            const response = await Load_Removed_File();
            if (response.Type === "Token expired") {
                setType("login");
                return;
            }
            if (response.Type === "Trashes") {
                if (response.Error) {
                    console.log(response.Message);
                    return
                }
                setListTrash(response.List_files ?? []);
            }
        }
        Load_trashes_File();
    }, []);
    useEffect(() => {
        async function Load_trashes_Folder() {
            const response = await Load_Removed_Folder();
            if (response.Type === "Token expired") {
                setType("login");
                return;
            }
            if (response.Type === "Trashes") {
                if (response.Error) {
                    console.log(response.Message);
                    return
                }
                setListTrashFolder(response.List_folders ?? []);
            }
        }
        Load_trashes_Folder();
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
    const atTrashRoot = paths.length === 1;
    const visibleTrashedFolders = listTrashedFolders?.filter(folder =>
        atTrashRoot
            ? folder?.IsTrashed && !folder?.IsTrashedSpread
            : folder?.IsTrashedSpread && folder?.ParentFolder === paths[paths.length - 1]?.Folder_id
    );
    const visibleTrashedFiles = listTrashed?.filter(file =>
        atTrashRoot
            ? file?.IsTrashed && !file?.IsTrashedSpread
            : file?.IsTrashedSpread && file?.ParentFolder === paths[paths.length - 1]?.Folder_id
    );

    return (
        <div
            className='trashed-page'
            onClick={() => setShowNotice(false)}
            style={{
                gridColumn: showPreview || showNotice ? "2/3" : "2/4",
                zIndex: pages === "Trash" ? 30 : -30,
                pointerEvents: pages === "Trash" ? "auto" : "none",
                opacity: pages === "Trash" ? 1 : 0,
            }}
        >
            <div className='address'>
                <BreadCrump paths={paths} setPaths={setPaths}/>
            </div>
            <hr/>
            <p>Removed folders</p>
            <div className='list-trash-folder' style={{justifyContent: visibleTrashedFolders?.length === 0 ? "center" : "flex-start"}}>
                {visibleTrashedFolders?.length === 0 ? (
                    <p>No folder removed</p>
                ) : (
                    visibleTrashedFolders?.map((folder) => (
                        <div
                            key={folder?.Folder_id}
                            title={folder?.Name_Folder}
                            onClick={() => {
                                setPaths((prev) => [...prev, folder]);
                            }}
                            ref={(el) => {
                                if (el) fileRefs.current[folder?.Folder_id] = el;
                            }}
                            className={`folder ${highlightFileId === folder?.Folder_id ? 'highlight-file' : ''}`}
                        >
                            <span className="folder-name"><span>&#128465;</span>{folder?.Name_Folder}</span>
                            {folder?.IsTrashed && (
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
                                        Type_Menu="Trash"
                                        each_folder={folder}
                                        listTrashedFolders={listTrashedFolders}
                                        setListTrashFolder={setListTrashFolder}
                                        listStarredFolders={listStarredFolders}
                                        setListStarFolder={setListStarFolder}
                                        setType={setType}
                                        setNotice={setNotice}
                                        setFolders={setFolders}
                                        setLeft={setLeft}
                                        setUsed={setUsed}
                                        paths={paths}
                                        setFiles={setFiles}
                                        setListTrash={setListTrash}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <p>Removed files</p>
            <hr />
            <div className='list-trash'>
                {visibleTrashedFiles?.length === 0 ? (
                    "No file removed"
                ) : (
                    visibleTrashedFiles?.map((file) => (
                        <div key={file?.File_id} 
                        className='one_file'
                        title={file?.Name}
                        onClick={async () => {
                            const MimeType = file?.MimeType;
                            const isPreviewable =
                                MimeType?.startsWith("image/") ||
                                MimeType === "application/pdf" ||
                                MimeType?.startsWith("video/") ||
                                MimeType?.startsWith("audio/");

                            if (cacheURL.current[file?.File_id] && cacheURL.current[file?.File_id].expired > Date.now()) {
                                if (isPreviewable) {
                                    setPreview({ ...file, URL: cacheURL.current[file?.File_id].url });
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

                            if (cacheURL.current[file?.File_id] && cacheURL.current[file?.File_id].expired > Date.now()) {
                                if (isPreviewable) {
                                    window.open(cacheURL.current[file.File_id].url);
                                    return;
                                } else {
                                    const confirm_download = confirm("Download this file?");
                                    if (confirm_download) {
                                        downloadFile(cacheURL.current[file?.File_id].url, file?.Name);
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
                            window.open(cacheURL.current[file?.File_id].url);
                            cacheURL.current[file?.File_id] = {
                                url: response.URL,
                                expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                            };
                            if (!isPreviewable) {
                                const confirm_download = confirm("Download this file?");
                                if (confirm_download) {
                                    downloadFile(cacheURL.current[file?.File_id].url, file?.Name);
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
                            ><span>&#128465;</span>{file?.Name}</div>
                            {file?.IsTrashed && (
                                <div className='optionFile' onClick={() => setShowMenu(file?.File_id)}>
                                    &#8801;
                                    <Menu
                                        showMenu={showMenu === file?.File_id}
                                        Type_Menu="Trash"
                                        each_files={file}
                                        listTrashed={listTrashed}
                                        setListTrash={setListTrash}
                                        listStarred={listStarred}
                                        setListStar={setListStar}
                                        setFiles={setFiles}
                                        setLeft={setLeft}
                                        setUsed={setUsed}
                                        setType={setType}
                                        setNotice={setNotice}
                                        paths={paths}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Trashed