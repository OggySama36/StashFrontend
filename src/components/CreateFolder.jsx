import { useState } from 'react'
import '../layouts/layouts.css'
import { useUpload } from '../hooks/useUpload';
function regex_name(value){
    const invalid = /[/\\:*?"<>|]/
    return invalid.test(value);
}
function CreateFolder({ setType, create, setCreate, paths, setFolders }){
    const [value, setValue] = useState("");
    const { up_folders } = useUpload();
    return(
        <div className="create-table" 
        style={{
            opacity: create ? 1 : 0,
            pointerEvents: create ? "auto" : "none",
            zIndex: create ? 20 : -20,
        }}
        >
            <p>Your folder's name</p>
            <input 
            type="text"
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
            }}
            />
            <div className='button-save'>
                <button onClick={async () => {
                    if(regex_name(value) || value.trim() === ""){
                        alert("Not a valid folder name!");
                        setValue("");
                        return
                    }
                    else {
                        const response = await up_folders(value, paths[paths.length - 1].Folder_id);
                        if(response.Error && response.Type === "Token expired"){
                            setType("login");
                            setCreate(false);
                            return
                        }
                        if (!response.Error) {
                            setFolders(prev => [...prev, response]);
                            setValue("");
                            setCreate(false);
                            return
                        }
                        else {
                            setValue("");
                            return
                        }
                    }
                }}>Save</button>
                <button className='exit' onClick={() => {setCreate(false); setValue("");}}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CreateFolder