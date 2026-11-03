const urls = (modules) => Object.values(modules).sort();

export const calendarPhotos = urls(import.meta.glob('./media/calendars/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}', { eager: true, query: '?url', import: 'default' }));
export const stickerPhotos = urls(import.meta.glob('./media/stickers/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}', { eager: true, query: '?url', import: 'default' }));
export const livePhotos = urls(import.meta.glob('./media/live/*.{webp,jpg,jpeg,png,mp4,webm,JPG,JPEG,PNG,WEBP}', { eager: true, query: '?url', import: 'default' }));
