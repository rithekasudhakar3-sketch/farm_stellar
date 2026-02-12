const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // Import the multer upload config we just created
const Submission = require('../models/Submission');

// POST /api/proofs/upload
// Description: Uploads an image to Cloudinary and creates a submission record
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // 1. Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // 2. Get the Cloudinary URL (secure_url)
        // Cloudinary storage automatically puts the file info in req.file
        const startUrl = req.file.path; // or req.file.secure_url

        // 3. Create a new Submission (or just return the URL if that's what the frontend needs first)
        // For this simple example, we'll return the URL so the frontend can send it with the form,
        // OR we can create the submission here if we have body data.

        // Let's assume the user sends other data (questId, userId) in the body
        const { questId, userId, notes } = req.body;

        if (questId && userId) {
            const newSubmission = new Submission({
                userId,
                questId,
                proofUrl: startUrl, // Saving the Cloudinary URL
                status: 'pending',
                notes: notes || ''
            });

            await newSubmission.save();

            return res.status(201).json({
                message: 'Proof uploaded and submission created successfully',
                imageUrl: startUrl,
                submission: newSubmission
            });
        }

        // If just uploading image to get URL
        res.status(200).json({
            message: 'Image uploaded to Cloudinary successfully',
            imageUrl: startUrl,
            fileId: req.file.filename
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Something went wrong during upload' });
    }
});

module.exports = router;
