import { useEffect, useState, useRef } from 'react'
import '../layouts/layouts.css'
import CreateFolder from './CreateFolder'
import { useFiles } from '../hooks/useFiles';
import MenuFolder from './MenuFolder';

function FolderCard({
    setType,
    paths,
    setPaths,
    listStarredFolders,
    setListStarFolder,
    setListStar,
    listTrashedFolders,
    setListTrashFolder,
    setNotice,
    folders,
    setFolders,
    setLeft,
    setUsed,
    setFiles,
    setListTrash,
}) {
    const [create, setCreate] = useState(false);
    const { folders_loading } = useFiles();
    const [showMenu, setShowMenu] = useState(null);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const scrollRef = useRef(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        function handleWheel(e) {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        }

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);
    useEffect(() => {
        async function loadFolder() {
            const response = await folders_loading();
            if (response.Type === "Folders") {
                setFolders(response.List_folders);
            }
        }
        loadFolder();
    }, []);
    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest(".optionFile") && !event.target.closest(".menufolder")) {
                setShowMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="folders" ref={scrollRef}>
            <CreateFolder
                setType={setType}
                create={create}
                setCreate={setCreate}
                paths={paths}
                folders={folders}
                setFolders={setFolders}
            />
            <div className='folder' title='New folder' onClick={() => setCreate(true)}>
                +
            </div>
            {folders
                .filter(each_folder => each_folder?.ParentFolder === paths[paths.length - 1]?.Folder_id)
                .map(each_folder => (
                    <div
                        key={each_folder?.Folder_id}
                        className='folder'
                        title={each_folder?.Name_Folder}
                        onClick={() => setPaths((prev) => [...prev, each_folder])}
                    >
                        <span className="folder-name">
                            {listStarredFolders?.some((starred) => starred?.Folder_id === each_folder?.Folder_id) && <span>&#11088;</span>}
                            {each_folder?.Name_Folder}
                        </span>
                        <div
                            className='optionFile'
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPos({ top: rect.bottom, right: window.innerWidth - rect.right });
                                setShowMenu(each_folder?.Folder_id);
                            }}
                        >
                            &#8801;
                            <MenuFolder
                                each_folder={each_folder}
                                showMenu={showMenu === each_folder?.Folder_id}
                                position={menuPos}
                                listStarredFolders={listStarredFolders}
                                setListStarFolder={setListStarFolder}
                                listTrashedFolders={listTrashedFolders}
                                setListTrashFolder={setListTrashFolder}
                                setType={setType}
                                setNotice={setNotice}
                                setFolders={setFolders}
                                setUsed={setUsed}
                                setLeft={setLeft}
                                paths={paths}
                                setFiles={setFiles}
                                setListTrash={setListTrash}
                                setListStar={setListStar}
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default FolderCard