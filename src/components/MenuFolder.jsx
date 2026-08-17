import '../layouts/layouts.css'
import { useState } from 'react';
import { useFolders } from '../hooks/useFolders';

function MenuFolder({ 
    setType, 
    showMenu, 
    position, 
    listStarredFolders, 
    setListStarFolder, 
    each_folder, 
    listTrashedFolders, 
    setListTrashFolder, 
    Type_Menu, 
    setNotice,
    setFolders,
    setLeft,
    setUsed,
    setFiles,
    setListTrash,
    setListStar,
}) {
    const isStarred = listStarredFolders?.some(f => f?.Folder_id === each_folder?.Folder_id);
    const isTrashed = listTrashedFolders?.some(f => f?.Folder_id === each_folder?.Folder_id);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(each_folder?.Name_Folder);
    const { StarThisFolder, RemoveThisFolder, RenameThisFolder, DeleteThisFolder } = useFolders();
    async function handleStar() {
        const alreadyStarred = listStarredFolders?.some(f => f?.Folder_id === each_folder?.Folder_id);
        if (alreadyStarred) {
            const response = await StarThisFolder(each_folder?.Folder_id, "Unstar");
            if (response.Error) {
                setNotice((prev) => [...prev, `Unstar ${each_folder?.Name_Folder} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            if (response.Type === "Token expired") {
                setType("login");
                return;
            }
            setNotice((prev) => [...prev, `Unstar ${each_folder?.Name_Folder} successfully!`]);
            setListStarFolder((prev) => prev.filter(f => f?.Folder_id !== each_folder?.Folder_id));
        } else {
            const response = await StarThisFolder(each_folder?.Folder_id, "Star");
            if (response.Error) {
                setNotice((prev) => [...prev, `Star ${each_folder?.Name_Folder} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            setNotice((prev) => [...prev, `Star ${each_folder?.Name_Folder} successfully!`]);
            setListStarFolder((prev) => [...prev, each_folder]);
        }
    }

    async function handleTrash() {
        const alreadyTrashed = listTrashedFolders?.some(f => f?.Folder_id === each_folder?.Folder_id);
        if (alreadyTrashed) {
            const response = await RemoveThisFolder(each_folder?.Folder_id, "Restore");
            if (response.Error) {
                setNotice((prev) => [...prev, `Restore ${each_folder?.Name_Folder} unsuccessfully!`]);
                return;
            }
            if (response.Error && response.Type === "Token expired") {
                setType("login");
                return;
            }
            const returnedFolders = response.Folders ?? [];
            const returnedFiles = response.Files ?? [];
            setListTrashFolder((prev) => {
                const map = new Map(prev.map(f => [f.Folder_id, f]));
                returnedFolders.forEach(f => {
                    if (f.IsTrashed) {
                        map.set(f.Folder_id, { ...map.get(f.Folder_id), ...f });
                    } else {
                        map.delete(f.Folder_id);
                    }
                });
                return Array.from(map.values());
            });
            setFolders?.((prev) => {
                const backToActive = returnedFolders.filter(f => !f.IsTrashed);
                const existingIds = new Set(prev.map(f => f.Folder_id));
                return [...prev, ...backToActive.filter(f => !existingIds.has(f.Folder_id))];
            });

            setListTrash((prev) => {
                const map = new Map(prev.map(f => [f.File_id, f]));
                returnedFiles.forEach(f => {
                    if (f.IsTrashed) {
                        map.set(f.File_id, { ...map.get(f.File_id), ...f });
                    } else {
                        map.delete(f.File_id);
                    }
                });
                return Array.from(map.values());
            });
            setFiles?.((prev) => {
                const backToActive = returnedFiles.filter(f => !f.IsTrashed);
                const existingIds = new Set(prev.map(f => f.File_id));
                return [...prev, ...backToActive.filter(f => !existingIds.has(f.File_id))];
            });

            setUsed((prev) => prev += response.TotalSize);
            setLeft((prev) => prev -= response.TotalSize);
            setNotice((prev) => [...prev, `Restore ${each_folder?.Name_Folder} successfully!`]);
        } else {
            const response = await RemoveThisFolder(each_folder?.Folder_id, "Remove");
            if (response.Error) {
                setNotice((prev) => [...prev, `Remove ${each_folder?.Name_Folder} unsuccessfully!`]);
                return;
            }
            if (response.Error && response.Type === "Token expired") {
                setType("login");
                return;
            }
            const trashedFolders = response.Folders ?? [];
            const trashedFiles = response.Files ?? [];
            setListTrashFolder((prev) => {
                const map = new Map(prev.map(f => [f.Folder_id, f]));
                trashedFolders.forEach(f => map.set(f.Folder_id, { ...map.get(f.Folder_id), ...f }));
                return Array.from(map.values());
            });
            setFolders?.((prev) => {
                const trashedIds = new Set(trashedFolders.map(f => f.Folder_id));
                return prev.filter(f => !trashedIds.has(f.Folder_id));
            });

            setListTrash((prev) => {
                const map = new Map(prev.map(f => [f.File_id, f]));
                trashedFiles.forEach(f => map.set(f.File_id, { ...map.get(f.File_id), ...f }));
                return Array.from(map.values());
            });
            setFiles?.((prev) => {
                const trashedIds = new Set(trashedFiles.map(f => f.File_id));
                return prev.filter(f => !trashedIds.has(f.File_id));
            });
            setListStarFolder?.((prev) => {
                const trashedIds = new Set(trashedFolders.map(f => f.Folder_id));
                return prev.filter(f => !trashedIds.has(f.Folder_id));
            });
            setListStar?.((prev) => {
                const trashedIds = new Set(trashedFiles.map(f => f.File_id));
                return prev.filter(f => !trashedIds.has(f.File_id));
            });

            setNotice((prev) => [...prev, `Remove ${each_folder?.Name_Folder} successfully!`]);
            setUsed((prev) => prev -= response.TotalSize);
            setLeft((prev) => prev += response.TotalSize);
        }
    }

    async function handleRename() {
        if (!isRenaming) {
            setIsRenaming(true);
            return;
        }
        if (newName.trim() === "" || newName === each_folder?.Name_Folder) {
            setIsRenaming(false);
            return;
        }
        const response = await RenameThisFolder(each_folder?.Folder_id, newName);
        if (response.Error) {
            setNotice((prev) => [...prev, `Rename folder unsuccessfully!`]);
            console.log(response.Message);
            setIsRenaming(false);
            return;
        }
        if (response.Type === "Token expired") {
            setType("login");
            return;
        }
        setListTrashFolder((prev) => prev.map(f =>
            f?.Folder_id === each_folder?.Folder_id ? { ...f, Name_Folder: newName } : f
        ));
        setNotice((prev) => [...prev, `Renamed to "${newName}" successfully!`]);
        setIsRenaming(false);
    }

    async function handleRemovePermanently() {
        const response = await DeleteThisFolder(each_folder?.Folder_id);
        if(response.Error) {
            setNotice((prev) => [...prev, `Delete ${each_folder?.Name_Folder} unsuccessfully!`]);
            console.log(response.Message);
            return
        }
        if (response.Error && response.Type === "Token expired") {
            setType("login");
            return;
        }
        setListTrashFolder((prev) => prev.filter(f => f?.Folder_id !== each_folder?.Folder_id));
        setNotice((prev) => [...prev, `Deleted ${each_folder?.Name_Folder} permanently!`]);
    }

    return (
        <ul
            className='menufolder'
            style={{
                position: "fixed",
                top: position?.top ?? 0,
                right: position?.right ?? 0,
                display: showMenu ? "block" : "none"
            }}
        >
            {isRenaming ? (
                <li>
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
                        onBlur={handleRename}
                    />
                </li>
            ) : (
                <li onClick={handleRename}
                    style={{ display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block" }}>
                    Rename
                </li>
            )}
            <hr style={{ display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block" }} />

            <li onClick={handleStar}
                style={{ display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block" }}>
                {isStarred ? "Unstar" : "Star"}
            </li>
            <hr style={{ display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block" }} />

            <li onClick={handleTrash}
                style={{ display: Type_Menu === "Trash" ? "block" : Type_Menu === "Star" ? "none" : "block" }}>
                {isTrashed ? "Restore from trash" : "Remove to trash"}
            </li>
            <hr style={{display: Type_Menu === "Star" || Type_Menu === "Trash"  ? "none" : "block"}}/>
            <li onClick={handleRemovePermanently}
                style={{display: Type_Menu === "Trash" ? "block" : "none"}}>
                Remove permanently
            </li>
        </ul>
    )
}

export default MenuFolder