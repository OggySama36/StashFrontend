import '../layouts/layouts.css'
import { useFiles } from '../hooks/useFiles';

function Menu({ setType, showMenu, listStarred, setListStar, each_files, listTrashed, setListTrash, setFiles, setLeft, setUsed, Type_Menu, setShareProgress, setShare, setNotice, paths }) {
    const isStarred = listStarred?.some(f => f?.File_id === each_files?.File_id);
    const isTrashed = listTrashed?.some(f => f?.File_id === each_files?.File_id);
    const { StarThisFile, DeleteThisFile, RemoveThisFile } = useFiles();
    async function handleStar() {
        const alreadyStarred = listStarred.some(f => f?.File_id === each_files?.File_id);
        if (alreadyStarred) {
            const response = await StarThisFile(each_files?.File_id, "Unstar");
            if (response.Error) {
                setNotice((prev) => [...prev, `Unstar ${each_files?.Name} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            setNotice((prev) => [...prev, `Unstar ${each_files?.Name} successfully!`]);
            if (response.Error && response.Type === "Token expired") {
                setType("login");
                return;
            }
            setListStar((prev) => prev.filter(f => f?.File_id !== each_files?.File_id));
        }
        else {
            const response = await StarThisFile(each_files?.File_id, "Star");
            if (response.Error) {
                setNotice((prev) => [...prev, `Star ${each_files?.Name} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            setNotice((prev) => [...prev, `Star ${each_files?.Name} successfully!`]);
            setListStar((prev) => [...prev, each_files]);
        }
    }

    async function handleTrash() {
        const alreadyTrashed = listTrashed.some(f => f?.File_id === each_files?.File_id);
        if (alreadyTrashed) {
            const response = await RemoveThisFile(each_files?.File_id, "Restore");
            if (response.Error) {
                setNotice((prev) => [...prev, `Restore ${each_files?.Name} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            if (response.Error && response.Type === "Token expired") {
                setType("login");
                return;
            }
            setListTrash((prev) => prev.filter(f => f?.File_id !== each_files?.File_id));
            setUsed((prev) => prev += each_files?.Size);
            setLeft((prev) => prev -= each_files?.Size);
            setFiles((prev) => {
                const exists = prev.some(f => f?.File_id === each_files?.File_id);
                return exists ? prev : [...prev, each_files];
            });
            setNotice((prev) => [...prev, `Restore ${each_files?.Name} successfully!`]);
        } else {
            const response = await RemoveThisFile(each_files?.File_id, "Remove");
            if (response.Error) {
                setNotice((prev) => [...prev, `Remove ${each_files?.Name} unsuccessfully!`]);
                console.log(response.Message);
                return;
            }
            const trashedFile = { ...each_files, IsTrashed: true, IsTrashedSpread: false };
            setListTrash((prev) => {
                const map = new Map(prev.map(f => [f.File_id, f]));
                map.set(trashedFile.File_id, { ...map.get(trashedFile.File_id), ...trashedFile });
                return Array.from(map.values());
            });
            setListStar((prev) => prev.filter(f => f?.File_id !== each_files?.File_id));
            setUsed((prev) => prev -= each_files?.Size);
            setLeft((prev) => prev += each_files?.Size);
            setFiles((prev) => prev.filter(f => f?.File_id !== each_files?.File_id));
            setNotice((prev) => [...prev, `Remove ${each_files?.Name} successfully!`]);
        }
    }
    async function handleRemovePermanently() {
        const response = await DeleteThisFile(each_files?.File_id);
        if(response.Error) {
            setNotice((prev) => [...prev, `Delete ${each_files?.Name} unsuccessfully!`]);
            console.log(response.Message);
            return
        }
        if (response.Error && response.Type === "Token expired") {
            setType("login");
            return;
        }
        setListTrash((prev) => prev.filter(f => f?.File_id !== each_files?.File_id));
        setNotice((prev) => [...prev, `Deleted ${each_files?.Name} permanently!`]);
    }
    return (
        <ul className='menufile' style={{ display: showMenu ? "block" : "none" }}>
            <li onClick={handleStar} 
            style={{display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block"}}>
                {isStarred ? "Unstar" : "Star"}
            </li>
            <hr style={{display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block"}}/>
            <li onClick={handleTrash} 
                style={{display: Type_Menu === "Trash" ? "block" : Type_Menu === "Star" ? "none" : "block"}}>
                {isTrashed ? "Restore from trash" : "Remove to trash"}
            </li>
            <hr style={{display: Type_Menu === "Trash" ? "block" : Type_Menu === "Star" ? "none" : "block"}}/>
            <li style={{display: Type_Menu === "Star" ? "block" : Type_Menu === "Trash" ? "none" : "block"}}
            onClick={() => {
                setShareProgress("Choice");
                setShare(each_files);}}>
                    Share
            </li>
            <hr style={{display: Type_Menu === "Star" ? "none" : Type_Menu === "Trash" ? "none" : "block"}}/>
            <li onClick={handleRemovePermanently}
                style={{display: Type_Menu === "Trash" ? "block" : "none"}}>
                Remove permanently
            </li>
        </ul>
    )
}

export default Menu