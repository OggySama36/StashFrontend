# Stash Frontend

React + Vite

## Run local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Tree

```
Stash/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   └── image-icon.png
│   │
│   ├── components/
│   │   ├── Avatar.jsx
│   │   ├── Breadcrump.jsx
│   │   ├── CreateFolder.jsx
│   │   ├── FileCard.jsx
│   │   ├── FolderCard.jsx
│   │   ├── MenuFile.jsx
│   │   ├── MenuFolder.jsx
│   │   ├── Notification.jsx
│   │   ├── Warning.jsx
│   │   ├── share-page.jsx
│   │   └── uploadProgress.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFiles.js
│   │   ├── useFolders.js
│   │   └── useUpload.js
│   │
│   ├── layouts/
│   │   ├── Header.jsx
│   │   ├── MainLayout.jsx
│   │   ├── SideBar.jsx
│   │   └── layouts.css
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Auth.css
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── Drives/
│   │   │   ├── home.jsx
│   │   │   ├── share.jsx
│   │   │   ├── starred.jsx
│   │   │   └── trash.jsx
│   │   │
│   │   ├── Preview/
│   │   │   └── FilePreview.jsx
│   │   │
│   │   └── Profile/
│   │       └── profile.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authServices.js
│   │   ├── documentsService.js
│   │   └── downloadService.js
│   │
│   ├── utils/
│   │   └── formatByte.js
│   │
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```