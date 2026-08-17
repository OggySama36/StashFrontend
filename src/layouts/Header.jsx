import './layouts.css'
import { useFiles } from '../hooks/useFiles'
import Avatar from '../components/Avatar'
import { Search, Bell, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useRef } from 'react';

function mergeFoundResult(response){
    const matchedFolders = (response.List_Found_Folders ?? [])
        .map((f) => ({ type: "folder", id: f?.Folder_id, name: f?.Name_Folder, original: f }));
    const matchedFiles = (response.List_Found ?? [])
        .map((f) => ({ type: "file", id: f?.File_id, name: f?.Name, original: f }));
    return [...matchedFolders, ...matchedFiles];
}

function Header({
    pages,
    setType,
    showPreview,
    setShow,
    setShowNotice,
    listFind,
    setFind,
    setPaths,
    setHighlightFileId,
    valueSearch,
    setValueSearch,
    setGoToProfile,
    Me,
    avatarUrl
}){
    const { FindDocuments, GoToFile } = useFiles();
    const searchingTimeout = useRef(null);

    return(
        <div className='header'>
            <div className='box_find_files'>
                <input 
                placeholder='Search files...' 
                type='text'
                value={valueSearch}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setValueSearch(newValue);
                    clearTimeout(searchingTimeout.current);
                    setFind([]);
                    if(newValue.trim() === ""){
                        return
                    }
                    if(pages === "MyDrive"){
                        searchingTimeout.current = setTimeout(async() => {
                            const response = await FindDocuments(newValue, pages);
                            console.log("MyDrive response:", response);
                            if (response.Error && response.Type === "Token expired") {
                                setType("login");
                                return;
                            }
                            if(!response.Error){
                                setFind(mergeFoundResult(response));
                            }
                        }, 100);
                    } else if(pages === "Star"){
                        searchingTimeout.current = setTimeout(async() => {
                            const response = await FindDocuments(newValue, pages);
                            console.log("Star response:", response);
                            if (response.Error && response.Type === "Token expired") {
                                setType("login");
                                return;
                            }
                            if(!response.Error){
                                setFind(mergeFoundResult(response));
                            }
                        }, 100);
                    } else if(pages === "Trash"){
                        searchingTimeout.current = setTimeout(async() => {
                            const response = await FindDocuments(newValue, pages);
                            console.log("Trash response:", response);
                            if (response.Error && response.Type === "Token expired") {
                                setType("login");
                                return;
                            }
                            if(!response.Error){
                                setFind(mergeFoundResult(response));
                            }
                        }, 100);
                    }
                }}
                />
                <div className='clear-content'
                style={{
                    opacity: valueSearch === "" ? 0 : 1,
                    pointerEvents: valueSearch === "" ? "none" : "auto"
                }}
                onClick={() => {
                    setValueSearch("");
                    setFind([]);
                }}
                >&times;</div>
            </div>
            {listFind.length > 0 && (
                <div className='search-results'>
                    {listFind?.map((item, index) => (
                        <>
                            <p key={index}
                            onClick={async() => {
                                if (pages !== "MyDrive" && pages !== "Trash") {
                                    setFind([]);
                                    setValueSearch("");
                                    setHighlightFileId(item?.id);
                                    return;
                                }

                                const targetFolderId = item.type === "folder"
                                    ? item.original?.Folder_id
                                    : item.original?.ParentFolder;

                                const response = await GoToFile(targetFolderId);
                                if (response.Error && response.Type === "Token expired") {
                                    setType("login");
                                    return;
                                }
                                if(response.Error){
                                    console.log(response.Message);
                                    return
                                }
                                setPaths([{"Name_Folder": "My Drive", "Folder_id": "Root"}, ...response.Path]);
                                setFind([]);
                                setValueSearch("");
                                if (item.type === "file") {
                                    setHighlightFileId(item?.id);
                                }
                            }}
                            >
                                {item.type === "folder" ? "📁 " : "📄 "}{item.name}
                            </p>
                            <hr/>
                        </>
                    ))}
                </div>
            )}
            <div className='user-layouts'>
                <Bell size={18} className='bell' onClick={() => {setShowNotice((prev) => !prev)}}/>
                <div onClick={() => setGoToProfile(true)}><Avatar Me={Me} avatarUrl={avatarUrl}/></div>
                {showPreview ? <PanelRightClose size={18} className='closePreview' onClick={() => setShow(prev => !prev)}/> : <PanelRightOpen size={18} className='closePreview' onClick={() => setShow(prev => !prev)}/>}
            </div>
        </div>
    )
}

export default Header