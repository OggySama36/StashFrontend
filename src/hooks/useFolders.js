import { star_folder, remove_folder, rename_folder, load_trash_folders, load_star_folders, delete_folder } from "../services/documentsService";

function useFolders() {
    async function StarThisFolder(folder_id, type) {
        const response = await star_folder(folder_id, type);
        return response
    }

    async function RemoveThisFolder(folder_id, type) {
        const response = await remove_folder(folder_id, type);
        return response
    }

    async function RenameThisFolder(folder_id, new_name) {
        const response = await rename_folder(folder_id, new_name);
        return response
    }

    async function Load_Removed_Folder() {
        const response = await load_trash_folders();
        return response
    }

    async function Load_Starred_Folder() {
        const response = await load_star_folders();
        return response
    }

    async function DeleteThisFolder(file_id) {
            const response = await delete_folder(file_id);
            return response
        }

    return { StarThisFolder, RemoveThisFolder, RenameThisFolder, Load_Removed_Folder, Load_Starred_Folder, DeleteThisFolder }
}
export { useFolders };