# Name project
Stash
## Target
upload documents to virtual folder and save on clouds
## Project Tree(Frontend)
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── FileCard/
│   │   ├── FolderCard/
│   │   ├── Breadcrumb/
│   │   └── UploadProgress/
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Drive/
│   │   │   ├── index.jsx
│   │   │   ├── Folder.jsx
│   │   │   ├── Shared.jsx
│   │   │   ├── Starred.jsx
│   │   │   └── Trash.jsx
│   │   └── Preview/
│   │       └── FilePreview.jsx
│   │
│   ├── hooks/
│   │   ├── useUpload.js
│   │   ├── useFiles.js
│   │   └── useAuth.js
│   │
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── fileStore.js
│   │   └── uploadStore.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── fileService.js
│   │   ├── folderService.js
│   │   └── authService.js
│   │
│   ├── utils/
│   │   ├── formatBytes.js
│   │   ├── getMimeType.js
│   │   └── constants.js
│   │
│   └── router/
│       └── index.jsx
