import '../layouts/layouts.css'

function Notifications({ notifications, showNotice, setNotice }){
    return (
        <div className='notice-box' style={{
                zIndex: showNotice ? 10 : -10,
                pointerEvents: showNotice ? "auto" : "none",
                position: showNotice ? "inherit" : "fixed",
                transform: showNotice ? "translateX(0px)" : "translateX(100vw)",
            }}>
            <h1>Notifications</h1>
            <div className='line-notice'>
                <span onClick={() => {
                    if(showNotice.length === 0){return}
                    setNotice([])
                }}>Clear</span>
                <hr/>
            </div>
            <div className='notification-list'>
                {notifications.length === 0 ? "No new notifications" : notifications.map((notice, index) => {
                        return (
                        <>
                            <p key={index} style={{marginTop: index === 0 ? "0px" : "10px"}}>{notice}</p>
                            <hr style={{marginTop: "6px"}}/>
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default Notifications