import '../../layouts/layouts.css'

function Preview({ showPreview, preview, showNotice }){
    if (!preview){
        return(<div className='content-preview' 
        style={{
            zIndex: showPreview && !showNotice ? 10 : -10,
            pointerEvents: showPreview && !showNotice ? "auto" : "none",
            position: showPreview && !showNotice ? "inherit" : "fixed",
            transform: showPreview && !showNotice ? "translateX(0px)" : "translateX(100vw)",
        }}
        ><p>Choose a file to preview</p></div>)
    }
    const { URL, MimeType, Name } = preview;
    return(
        <div className='preview' 
        style={{
            zIndex: showPreview ? 10 : -10,
            pointerEvents: showPreview ? "auto" : "none",
            transform: showPreview ? "translateX(0px)" : "translateX(100vw)",
        }}
        >
            <div className='content-preview'>
                {
                    MimeType?.startsWith("image/") 
                    ? (
                        <img src={URL} style={{maxWidth: "100%", maxHeight: "100%"}}/>
                    ) 
                    : 
                    MimeType?.startsWith("application/pdf")
                    ? (
                        <iframe src={URL} style={{ width: "100%", height: "100%", border: "none" }} />
                    )
                    :
                    MimeType?.startsWith("video/")
                    ? (
                        <video src={URL} controls style={{ maxWidth: "100%" }} />
                    )
                    :
                    MimeType?.startsWith("audio/")
                    ? (
                        <audio src={URL} controls />
                    ) 
                    :
                    <p>Choose a file to preview</p>
                }
            </div>
        </div>
    )
}

export default Preview