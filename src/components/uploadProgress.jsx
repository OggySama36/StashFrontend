import '../layouts/layouts.css'
function Progress({ progress, setProgress, isLoading, isSaving }) {
    return (
        <div className='progress' 
        style={{
            transform: progress ? "translateY(0)" : "translateY(-100vh)",
            display: progress ? "block" : "none",
        }}
        >
            <div className='content-upload'>
                <div className='text-upload'>
                    {isSaving ? "Complete!" : 
                     isLoading === 100 ? "Saving..." :
                     isLoading === 0 ? "Processing" : 
                     `Uploading ${Math.round(isLoading)}%`}
                </div>
                <div className='cancel-show'
                    onClick={() => {setProgress(false)}}
                >&#215;</div>
            </div>
            <div className='upload_progress_bar'>
                <div className='isLoading' style={{
                    width: `${isLoading}%`
                }}></div>
            </div>
        </div>
    )
}

export default Progress