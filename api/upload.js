// api/upload.js - Simple and reliable Vercel Blob upload
import { put } from '@vercel/blob';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the raw body as buffer (this works better for file uploads)
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Basic check - we expect a file in the request
        if (buffer.length === 0) {
            return res.status(400).json({ error: 'No file received' });
        }

        // Create a filename
        const timestamp = Date.now();
        const filename = `kuccps-${timestamp}.jpg`;   // You can improve this later

        // Upload directly to Vercel Blob using the buffer
        const blob = await put(filename, buffer, {
            access: 'public',           // So images can be viewed by anyone
            addRandomSuffix: true,
        });

        console.log('Upload successful:', blob.url);

        return res.status(200).json({
            url: blob.url,
            success: true
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to upload image',
            success: false
        });
    }
}