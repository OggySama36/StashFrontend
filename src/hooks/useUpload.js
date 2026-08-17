import { upload_files as FilesAPI } from "../services/documentsService";
import { upload_folders as FoldersAPI } from "../services/documentsService";

const useUpload = () => {
    const up_files = async (file, parent_folder, onProgress) => {
        const response = await FilesAPI(file, parent_folder, onProgress);
        if(response.Error){
            alert(response.Message);
            return
        }
        else {
            return response
        }
    }

    const up_folders = async (Name_Folder, parent_folder) => {
        const response = await FoldersAPI(Name_Folder, parent_folder);
        if(response.Error){
            alert(response.Message);
            return response
        }
        else {
            alert(response.Message);
            return response
        }
    }

    return { up_files, up_folders }
}

export { useUpload };