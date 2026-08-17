function Avatar({ size = 40, Me, avatarUrl }) {
    const letter = Me?.charAt(0).toUpperCase()
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEAA7', '#DDA0DD',
        '#98D8C8', '#F7DC6F', '#BB8FCE'
    ]
    const index = Me?.charCodeAt(0) % colors.length
    const bgColor = colors[index]
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt="avatar"
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                }}
            />
        )
    }
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '500',
            fontSize: size * 0.4,
            cursor: 'pointer'
        }}>
            {letter}
        </div>
    )
}

export default Avatar