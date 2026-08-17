import { Link2, Mail, X, ArrowLeft } from 'lucide-react'
import '../layouts/layouts.css'
import { useFiles } from '../hooks/useFiles';
import { useState } from 'react';

function SharePage({ ShareProgress, setShareProgress, Share, setShare, setType, setListShare }) {
    function CopyURL(URL){
        window.navigator.clipboard.writeText(URL);
    }
    const { getURL, Send_Gmail, Send_URL } = useFiles();
    const [appear_notice, setAppear] = useState("none");
    const [TypeShare, setTypeShare] = useState("default");
    const [receive, setReceive] = useState("");
    const [note, setNote] = useState("");
    const [sending, setSending] = useState(false);

    function closeAndReset(){
        setTypeShare("default");
        setAppear("none");
        setShareProgress("default");
    }

    async function handleCopyLink(){
        let URL = Share?.URL;
        if (!URL){
            const response = await getURL(Share?.File_id);
            if (response.Error && response.Type === "Token expired") {
                setType("login");
                return
            }
            URL = response.URL;
            setShare({...Share, URL});
        }
        CopyURL(URL);
        const response = await Send_URL(Share?.File_id);
        if (response.Error) {
            console.log(response.Message);
            return
        }
        setListShare((prev) => [...(prev ?? []), response]);
        setTypeShare("copyURL");
        setAppear("disappear-copied");
        setTimeout(closeAndReset, 1800);
    }

    async function ShareMail() {
        if(receive.trim() === ""){alert("Receive email can not be empty!"); return}
        setSending(true);
        const response = await Send_Gmail(Share?.File_id, Share?.Name, receive, note);
        setSending(false);
        if (response.Error && response.Type === "Token expired") {
            setReceive("");
            setNote("");
            setType("login");
            return
        }
        if (!response.Error){
            setTypeShare("Email");
            setListShare((prev) => [...(prev ?? []), response]);
            setAppear("disappear-copied");
            setReceive("");
            setNote("");
            setTimeout(closeAndReset, 1800);
            return
        }
    }

    const isOpen = ShareProgress === "Choice" || ShareProgress === "Gmail";

    return (
        <div className="share-overlay"
            style={{
                zIndex: isOpen ? 200 : -30,
                pointerEvents: isOpen ? "auto" : "none",
                opacity: isOpen ? 1 : 0,
            }}
            onClick={() => setShareProgress("default")}
        >
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <button className="share-close-btn" onClick={() => setShareProgress("default")}>
                    <X size={18}/>
                </button>

                {ShareProgress === "Gmail" ? (
                    <>
                        <button className="share-back-btn" onClick={() => setShareProgress("Choice")}>
                            <ArrowLeft size={14}/> Back
                        </button>
                        <h2>Send via email</h2>
                        <div className="share-fields">
                            <input
                                type="email"
                                placeholder="Recipient's email"
                                value={receive}
                                onChange={(e) => setReceive(e.target.value)}
                            />
                            <textarea
                                placeholder="Add a note (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <div className="handle-signout-btn">
                            <button disabled={sending} onClick={() => setShareProgress("Choice")}>Cancel</button>
                            <button disabled={sending} onClick={ShareMail}>
                                {sending ? <span className="btn-spinner"></span> : "Send"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Share file</h2>
                        <p className="share-modal-subtext">{Share?.Name}</p>
                        <div className="share-options">
                            <button className="share-option-card" onClick={handleCopyLink}>
                                <Link2 size={20}/>
                                <span>Copy link</span>
                            </button>
                            <button className="share-option-card" onClick={() => setShareProgress("Gmail")}>
                                <Mail size={20}/>
                                <span>Send via email</span>
                            </button>
                        </div>
                    </>
                )}

                <div className={`share-toast ${appear_notice}`}>
                    {TypeShare === "copyURL" ? "Link copied" : TypeShare === "Email" ? "File shared" : null}
                </div>
            </div>
        </div>
    )
}

export default SharePage