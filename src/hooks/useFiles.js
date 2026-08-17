import { 
    load_folders, 
    load_files, 
    get_URL_file, 
    get_usage, 
    star_file, 
    remove_file, 
    load_trash_files, 
    load_star_files, 
    delete_file, 
    send_mail, 
    find_files,
    goToFile,
    send_url,
    load_share_files, 
} from "../services/documentsService";

function useFiles() {
    async function folders_loading() {
        const response = await load_folders();
        if(response.Error){
            return response
        }
        else{
            return response
        }
    }

    async function files_loading() {
        const response = await load_files();
        if(response.Error){
            return response
        }
        else{
            return response
        }
    }
    async function getStorage() {
        const response = await get_usage();
        return response
    }

    const goToPath = (setPaths, index) => {
        setPaths((prev) => prev.slice(0, index + 1))
    }

    const getURL = async(file) => {
        const response = await get_URL_file(file)
        return response
    }

    async function StarThisFile(file_id, type) {
        const response = await star_file(file_id, type);
        return response
    }

    async function RemoveThisFile(file_id, type) {
        const response = await remove_file(file_id, type);
        return response
    }

    async function DeleteThisFile(file_id) {
        const response = await delete_file(file_id);
        return response
    }

    async function Load_Removed_File() {
        const response = await load_trash_files();
        return response
    }

    async function Load_Starred_File() {
        const response = await load_star_files();
        return response
    }

    async function Load_Shared_File() {
        const response = await load_share_files();
        return response
    }

    async function Send_URL(file_id) {
        const response = await send_url(file_id)
        return response
    }

    async function Send_Gmail(file_id, fileName, recipient, note) {
        const response = await send_mail(file_id, fileName, recipient, note);
        return response
    }

    async function FindDocuments(valueSearch, TypeFind) {
        const response = await find_files(valueSearch, TypeFind)
        return response
    }

    async function GoToFile(parent_folder) {
        const response = await goToFile(parent_folder);
        return response
    }

    return { folders_loading, files_loading, goToPath, getURL, getStorage, StarThisFile, RemoveThisFile, Load_Removed_File, Load_Starred_File, Load_Shared_File, DeleteThisFile, Send_URL, Send_Gmail, FindDocuments, GoToFile }
}
export { useFiles };