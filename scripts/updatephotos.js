console.log('cloud_name:', process.env.CLOUDINARY_CLOUD_NAME ? 'exists' : 'missing');
console.log('api_key:', process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing');
console.log('api_secret:', process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const result = await cloudinary.search
      .expression('folder:jackii') // match your upload folder
      .max_results(100)
      .execute();

    // Sort by created_at descending (newest first)
    const photos = result.resources
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(img => ({
        url: img.secure_url,
        public_id: img.public_id,
        format: img.format,
        width: img.width,
        height: img.height,
        created_at: img.created_at,
      }));

    fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
    console.log('✅ Created photos.json');
  } catch (err) {
    console.error('❌ Failed to fetch Cloudinary images:', err.message);
    process.exit(1);
  }
})();
