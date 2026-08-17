import { Type } from "lucide-react";
import api from "./api"

export const upload_files = async (file, parent_folder, onProgress) => {
    try {
        const formData = new FormData();
        formData.append("file", file)
        formData.append("parent_folder", parent_folder)
        const response = await api.post("/upload/files", formData, {
            onUploadProgress: (event) => {
                const percent = event.loaded / event.total * 100;
                console.log("percent:", percent, "time:", Date.now());
                onProgress(percent);
            }
        })
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const upload_folders = async (Name_Folder, parent_folder) => {
    try {
        const response = await api.post("/upload/folders", { Name_Folder, parent_folder })
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const load_folders = async () => {
    try {
        const response = await api.get("/load/folders")
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const load_files = async () => {
    try{
        const response = await api.get("/load/files")
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const get_URL_file = async (file) => {
    try {
        const response = await api.get(`/get/url_file?file_id=${file}`)
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const get_usage = async () => {
    try {
        const response = await api.get(`/get/usage`)
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const star_file = async (file_id, type) => {
    try {
        const response = await api.post(`/handle/star/file?file_id=${file_id}&type=${type}`)
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const remove_file = async (file_id, type) => {
    try {
        const response = await api.post(`/handle/remove/file?file_id=${file_id}&type=${type}`)
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const delete_file = async (file_id) => {
    try {
        const response = await api.delete(`/handle/delete/file?file_id=${file_id}`)
        return response
    } catch(error) {
        return error.response.data
    }
}

export const load_trash_files = async () => {
    try {
        const response = await api.get('/load/trash/file')
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const load_star_files = async () => {
    try {
        const response = await api.get('/load/star/file')
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const load_share_files = async () => {
    try {
        const response = await api.get('/load/shared/file')
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const load_trash_folders = async () => {
    try {
        const response = await api.get('/load/trash/folder')
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const load_star_folders = async () => {
    try {
        const response = await api.get('/load/star/folder')
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const send_url = async (file_id) => {
    try {
        const response = await api.post('/share/file/url', { file_id });
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const send_mail = async (file_id, fileName, recipient, note) => {
    try {
        const response = await api.post(`/share/file/gmail?recipient=${recipient}`, { file_id, fileName, note });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const find_files = async (valueSearch, TypeFind) => {
    try {
        const response = await api.get(`/find/files?value=${valueSearch}&TypeFind=${TypeFind}`);
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const goToFile = async (parent_folder) => {
    try {
        const response = await api.get(`/get/file/path?parent_id=${parent_folder}`);
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const star_folder = async (folder_id, type) => {
    try {
        const response = await api.post(`/handle/star/folder?folder_id=${folder_id}&type=${type}`)
        return response.data
    } catch(error) {
        return error.response.data
    }
}

export const remove_folder = async (folder_id, type) => {
    try {
        const response = await api.post(`/handle/remove/folder?folder_id=${folder_id}&type=${type}`)
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const rename_folder = async (folder_id, new_name) => {
    try {
        const response = await api.post(`/handle/rename/folder?folder_id=${folder_id}`, { new_name })
        return response.data
    } catch(error){
        return error.response.data
    }
}

export const delete_folder = async (folder_id) => {
    try {
        const response = await api.delete(`/handle/delete/folder?folder_id=${folder_id}`)
        return response
    } catch(error) {
        return error.response.data
    }
}

