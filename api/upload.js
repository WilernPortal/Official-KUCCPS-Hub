import { put } from '@vercel/blob';

// This tells Vercel to use the Node.js runtime (required for @vercel/blob)
export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body; // Vercel automatically handles FormData in Node runtime
        const file = formData.get('file'); // Get the file from FormData

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate a unique filename
        const filename = `kuccps-${Date.now()}-${file.name || 'image.jpg'}`;

        // Upload to Vercel Blob (public so images can be displayed)
        const blob = await put(filename, file, {
            access: 'public',           // Change to 'private' later if needed
            addRandomSuffix: true,
        });

        // Return the public URL
        return res.status(200).json({
            url: blob.url,
            success: true
        });

    } catch (error) {
        console.error('Blob upload error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to upload to Vercel Blob',
            success: false
        });
    }
}