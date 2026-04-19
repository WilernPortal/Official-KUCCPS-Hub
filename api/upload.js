// api/upload.js - Reliable Vercel Blob upload for admin.html
import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: false,   // Required for file uploads
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the file from FormData
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return res.status(400).json({ error: 'No file received' });
        }

        // Create a clean filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `kuccps-post-${timestamp}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        console.log('✅ Upload successful:', blob.url);

        return res.status(200).json({
            url: blob.url,
            success: true
        });

    } catch (error) {
        console.error('❌ Upload error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to upload image',
            success: false
        });
    }
}