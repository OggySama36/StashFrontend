import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import MainLayout from './layouts/MainLayout'
import {useState, useEffect} from 'react'
import { useAuth } from './hooks/useAuth'
import './App.css'
import Icon from './assets/image-icon.png'

function App() {
  const [type, setType] = useState("login");
  const [lock, setLock] = useState(false);
  const { checkAuth } = useAuth()
  const [Me, setMe] = useState("");
  const [NameUser, setName] = useState("");
  const [joinedDate, setJoin] = useState("");
  const [avatarUrl, setAvatar] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    async function load(){
      const check = await checkAuth();
      if(!check.Error){
        setType("main");
        setMe(check.Email);
        setName(check.Name);
        setJoin(check.JoinedDate);
        setAvatar(check.AvatarLink);
        setTheme(check.Theme);
      }
      else{
        setType("login");
        setMe("");
        setName("");
        setJoin("");
        setAvatar("");
        setTheme("");
      }
    }
    load();
  }, []);
  return (
    <div className="App" data-theme={theme}>
      <div className = "Auth-container" style={{ padding: type === "register" ? "10px" : type === "login" ? "10px" : "0px" }}>
        <div className="Auth-icon" style={{display: type === "main" ? "none" : "block"}}>
          <img src={Icon} alt="icon" />
          <h1>Stash</h1>
        </div>
        <div className="Auth-pageload">
          {type === "login" ? (
              <Login 
                  type={type} setType={setType} 
                  lock={lock} setLock={setLock} 
                  setMe={setMe} 
                  setName={setName} 
                  setJoin={setJoin} 
                  setAvatar={setAvatar}
                  setTheme={setTheme}
              />
          ) : type === "register" ? (
              <Register 
                  type={type} setType={setType} 
                  lock={lock} setLock={setLock} 
                  setMe={setMe} 
                  setName={setName} 
                  setJoin={setJoin} 
                  setAvatar={setAvatar}
                  setTheme={setTheme}
              />
          ) : type === "main" ? (
              <MainLayout 
                  type={type} setType={setType} 
                  Me={Me} setMe={setMe} 
                  NameUser={NameUser} setName={setName} 
                  joinedDate={joinedDate} setJoin={setJoin}
                  avatarUrl={avatarUrl} setAvatar={setAvatar}
                  theme={theme} setTheme={setTheme}
              />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App