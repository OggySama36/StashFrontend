import { useFiles } from "../hooks/useFiles"

function BreadCrump({ paths, setPaths }){
    const { goToPath } = useFiles();
    return(
        <div className="address">
            {paths?.map((path, index) => (
                <p key={path.Folder_id ?? "Root"} onClick={() => goToPath(setPaths, index)}>&nbsp;{path.Name_Folder}<span>&nbsp;&gt;</span></p>
            ))}
        </div>
    )
}

export default BreadCrump
//<p>&nbsp;&gt;</p>