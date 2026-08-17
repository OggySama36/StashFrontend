import '../../layouts/layouts.css'
import FolderCard from '../../components/FolderCard'
import FileCard from '../../components/FileCard'
import BreadCrump from '../../components/Breadcrump'
import Progress from '../../components/uploadProgress'
import SharePage from '../../components/share-page'
import { Share } from 'lucide-react'

function Home({
    listStarred,
    setListStar,
    listTrashed,
    setListTrash,
    showNotice,
    setShowNotice,
    pages,
    setType,
    isLoading,
    showPreview,
    paths,
    setPaths,
    files,
    setFiles,
    setPreview,
    cacheURL,
    progress,
    setProgress,
    showMenu,
    setShowMenu,
    setLeft, 
    setUsed,
    ShareProgress, 
    setShareProgress,
    Share,
    setShare,
    isSaving,
    setNotice,
    listStarredFolders,
    setListStarFolder,
    listTrashedFolders,
    setListTrashFolder,
    highlightFileId,
    setHighlightFileId,
    folders,
    setFolders,
    setListShare
}) {
    return (
        <>
            <SharePage 
            ShareProgress={ShareProgress} 
            setShareProgress={setShareProgress} 
            Share={Share} 
            setShare={setShare}
            setType={setType}
            setListShare={setListShare}
            />
            <div
                className='main-dashboard'
                onClick={() => setShowNotice(false)}
                style={{
                    gridColumn: showPreview || showNotice ? "2/3" : "2/4",
                    zIndex: pages === "MyDrive" && ShareProgress === "default" ? 30 : -30,
                    pointerEvents: pages === "MyDrive" && ShareProgress === "default" ? "auto" : "none",
                    opacity: pages === "MyDrive" && ShareProgress === "default" ? 1 : 0,
                }}
            >
                <div className='address'>
                    <BreadCrump paths={paths} setPaths={setPaths} />
                </div>
                <hr />
                <div className='listFolders'>
                    <p>Folders</p>
                    <FolderCard
                        setType={setType}
                        paths={paths}
                        setPaths={setPaths}
                        listStarredFolders={listStarredFolders}
                        setListStarFolder={setListStarFolder}
                        setListStar={setListStar}
                        listTrashedFolders={listTrashedFolders}
                        setListTrashFolder={setListTrashFolder} 
                        setNotice={setNotice}
                        folders={folders} 
                        setFolders={setFolders}
                        setUsed={setUsed}
                        setLeft={setLeft}
                        setFiles={setFiles}
                        setListTrash={setListTrash}
                    />
                </div>
                <div className='listFiles'>
                    <p>Files</p>
                    <FileCard
                        setType={setType}
                        paths={paths}
                        files={files}
                        setFiles={setFiles}
                        setPreview={setPreview}
                        cacheURL={cacheURL}
                        listStarred={listStarred}
                        setListStar={setListStar}
                        listTrashed={listTrashed}
                        setListTrash={setListTrash}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                        setUsed={setUsed}
                        setLeft={setLeft}
                        ShareProgress={ShareProgress}
                        setShareProgress={setShareProgress}
                        setShare={setShare}
                        setType={setType}
                        setNotice={setNotice}
                        highlightFileId={highlightFileId} 
                        setHighlightFileId={setHighlightFileId}
                    />
                </div>
                <Progress
                    progress={progress}
                    setProgress={setProgress}
                    isLoading={isLoading}
                    isSaving={isSaving}
                />
            </div>
        </>
    )
}

export default Home