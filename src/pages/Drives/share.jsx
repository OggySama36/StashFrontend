import { useEffect } from 'react';
import { useFiles } from '../../hooks/useFiles';
import { downloadFile } from '../../services/downloadService';
import '../../layouts/layouts.css'
import { FileText, FileImage, File as FileIcon, Mail, Link2 } from 'lucide-react'

function getFileIcon(mimeType){
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType?.startsWith('image/')) return FileImage;
    if (mimeType === 'text/plain') return FileText;
    if (
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) return FileText;
    return FileIcon;
}

function displayPerson(email, Me){
    return email === Me ? "me" : email;
}

function Shared({ pages, showPreview, listShared, setListShare, showNotice, setShowNotice, Me, setType, cacheURL, setPreview, valueSearch }){
    const { Load_Shared_File, getURL } = useFiles();
    useEffect(() => {
        async function LoadShared() {
            const response = await Load_Shared_File();
            if (response.Error) {
                console.log(response.Message);
                return
            }
            setListShare(response.ListShared ?? []);
        }
        LoadShared();
    }, []);

    const filteredShared = valueSearch?.trim()
        ? listShared?.filter((item) =>
            item?.Name?.toLowerCase().includes(valueSearch.trim().toLowerCase())
          )
        : listShared;

    return(
        <div className='shared-page' onClick={() => {setShowNotice(false)}}
        style={{
            gridColumn: showPreview || showNotice ? "2/3" : "2/4",
            zIndex: pages === "Share" ? 30 : -30,
            pointerEvents: pages === "Share" ? "auto" : "none",
            opacity: pages === "Share" ? 1 : 0,
        }}
        >
            <p>File shared</p>
            <hr/>
            {filteredShared?.length === 0 ? (
                <p className='share-history-empty'>
                    {valueSearch?.trim() ? "No matching file found" : "No file shared"}
                </p>
            ) : (
                <div className='share-history'>
                    <div className='share-history-header'>
                        <span className='share-history-col-file'>File</span>
                        <div className='share-history-divider'></div>
                        <span className='share-history-col-from'>From</span>
                        <div className='share-history-divider'></div>
                        <span className='share-history-col-to'>To</span>
                        <div className='share-history-divider'></div>
                        <span className='share-history-col-method'>Method</span>
                    </div>
                    {filteredShared?.map((item) => {
                        const Icon = getFileIcon(item?.MimeType);
                        const isReceived = item?.SharedTo === Me;
                        const isUrl = item?.Method === 'url';
                        const MimeType = item?.MimeType;
                        const isPreviewable =
                            MimeType?.startsWith("image/") ||
                            MimeType === "application/pdf" ||
                            MimeType?.startsWith("video/") ||
                            MimeType?.startsWith("audio/");
                        return (
                            <div
                                key={item?.Share_id ?? item?.File_id}
                                className={`share-history-row ${isReceived ? 'received' : ''}`}
                            >
                                <div
                                    className='share-history-col-file share-history-file-clickable'
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (cacheURL.current[item.File_id] && cacheURL.current[item.File_id].expired > Date.now()) {
                                            if (isPreviewable) {
                                                setPreview({ ...item, URL: cacheURL.current[item.File_id].url });
                                            }
                                            return;
                                        }
                                        const response = await getURL(item?.File_id);
                                        if (response.Error && response.Type === "Token expired") {
                                            setType("login");
                                            return;
                                        }
                                        setPreview({ ...item, URL: response.URL });
                                        cacheURL.current[item.File_id] = {
                                            url: response.URL,
                                            expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                        };
                                    }}
                                    onDoubleClick={async (e) => {
                                        e.stopPropagation();
                                        if (cacheURL.current[item.File_id] && cacheURL.current[item.File_id].expired > Date.now()) {
                                            downloadFile(cacheURL.current[item.File_id].url, item.Name);
                                            return;
                                        }
                                        const response = await getURL(item?.File_id);
                                        if (response.Error && response.Type === "Token expired") {
                                            setType("login");
                                            return;
                                        }
                                        cacheURL.current[item.File_id] = {
                                            url: response.URL,
                                            expired: Date.now() + 3 * 24 * 60 * 60 * 1000 - 60 * 1000,
                                        };
                                        downloadFile(response.URL, item.Name);
                                    }}
                                >
                                    <Icon size={18}/>
                                    <span>{item?.Name}</span>
                                </div>
                                <div className='share-history-divider'></div>
                                <div className='share-history-col-from'>
                                    <span>{displayPerson(item?.SharedBy, Me)}</span>
                                </div>
                                <div className='share-history-divider'></div>
                                <div className='share-history-col-to'>
                                    <span>{isUrl ? "Anyone" : displayPerson(item?.SharedTo, Me)}</span>
                                </div>
                                <div className='share-history-divider'></div>
                                <div className='share-history-col-method'>
                                    {isUrl ? (
                                        <>
                                            <Link2 size={14}/>
                                            <span>Link</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={14}/>
                                            <span>Gmail</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Shared