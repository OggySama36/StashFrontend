import '../layouts/layouts.css'
import { useFiles } from '../hooks/useFiles';
import { downloadFile } from '../services/downloadService';
import { useEffect, useRef } from 'react';
import Preview from '../pages/Preview/FilePreview';
import Menu from './MenuFile';

function FileCard({ 
    setType, 
    paths, 
    files, 
    setFiles, 
    setPreview, 
    cacheURL, 
    listStarred, 
    setListStar, 
    listTrashed, 
    setListTrash, 
    showMenu, 
    setShowMenu, 
    setLeft, 
    setUsed, 
    ShareProgress, 
    setShareProgress, 
    setShare, 
    setNotice,
    highlightFileId,
    setHighlightFileId
}) {
    const { files_loading, getURL } = useFiles();
    const fileRefs = useRef({});
    useEffect(() => {
    function handleClickOutside(event) {
        if (!event.target.closest(".optionFile") && !event.target.closest(".menufolder")) {
            setShowMenu(null);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
    useEffect(() => {
        async function loadFiles() {
            const response = await files_loading();
            if (response.Type === "Files") {
                setFiles(response.List_files);
            }
        }
        loadFiles();
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
        <div className="files">
            {files
                ?.filter((each_files) =>
                    each_files?.ParentFolder === paths[paths.length - 1]?.Folder_id &&
                    !listTrashed?.some((trashed) => trashed?.File_id === each_files?.File_id)
                )
                ?.map((each_files) => (
                    <div className='one_file'>
                        <div
                            ref={(element) => {if (element) fileRefs.current[each_files?.File_id] = element;}}
                            className={`file ${each_files?.File_id === highlightFileId ? 'highlight-file' : ''}`}
                            key={each_files?.File_id}
                            title={each_files?.Name}
                            onClick={async () => {
                                const MimeType = each_files?.MimeType;
                                const isPreviewable =
                                    MimeType?.startsWith("image/") ||
                                    MimeType === "application/pdf" ||
                                    MimeType?.startsWith("video/") ||
                                    MimeType?.startsWith("audio/");

                                if (cacheURL.current[each_files.File_id] && cacheURL.current[each_files.File_id].expired > Date.now()) {
                                    if (isPreviewable) {
                                        setPreview({ ...each_files, URL: cacheURL.current[each_files.File_id].url });
                                        return;
                                    } else {
                                        return;
                                    }
                                }
                                const response = await getURL(each_files?.File_id);
                                if (response.Error && response.Type === "Token expired") {
                                    setType("login");
                                    return;
                                }
                                setPreview({ ...each_files, URL: response.URL });
                                cacheURL.current[each_files.File_id] = {
                                    url: response.URL,
                                    expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                };

                                if (!isPreviewable) {
                                    return;
                                }
                            }}
                            onDoubleClick={async () => {
                                const MimeType = each_files?.MimeType;
                                const isPreviewable =
                                    MimeType?.startsWith("image/") ||
                                    MimeType === "application/pdf" ||
                                    MimeType?.startsWith("video/") ||
                                    MimeType?.startsWith("audio/");

                                if (cacheURL.current[each_files.File_id] && cacheURL.current[each_files.File_id].expired > Date.now()) {
                                    if (isPreviewable) {
                                        window.open(cacheURL.current[each_files.File_id].url);
                                        return;
                                    } else {
                                        const confirm_download = confirm("Download this file?");
                                        if (confirm_download) {
                                            downloadFile(cacheURL.current[each_files.File_id].url, each_files.Name);
                                            return;
                                        }
                                        return;
                                    }
                                }
                                const response = await getURL(each_files?.File_id);
                                if (response.Error && response.Type === "Token expired") {
                                    setType("login");
                                    return;
                                }
                                window.open(cacheURL.current[each_files.File_id].url);
                                cacheURL.current[each_files.File_id] = {
                                    url: response.URL,
                                    expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                };

                                if (!isPreviewable) {
                                    const confirm_download = confirm("Download this file?");
                                    if (confirm_download) {
                                        downloadFile(cacheURL.current[each_files.File_id].url, each_files.Name);
                                        return;
                                    }
                                    return;
                                }
                            }}
                        >
                            {listStarred?.some((starred) => starred?.File_id === each_files?.File_id) && <span>&#11088;</span>}
                            {each_files?.Name}
                        </div>

                        <div className='optionFile' onClick={() => setShowMenu(each_files?.File_id)}>
                            &#8801;
                            <Menu
                                each_files={each_files}
                                showMenu={showMenu === each_files?.File_id}
                                listStarred={listStarred}
                                setListStar={setListStar}
                                listTrashed={listTrashed}
                                setListTrash={setListTrash}
                                setFiles={setFiles}
                                setLeft={setLeft}
                                setUsed={setUsed}
                                ShareProgress={ShareProgress}
                                setShareProgress={setShareProgress}
                                setShare={setShare}
                                setType={setType}
                                setNotice={setNotice}
                                paths={paths}
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default FileCard