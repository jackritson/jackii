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
      .expression('folder:jackii')
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      format: img.format,
      width: img.width,
      height: img.height,
    }));

    fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
    console.log('✅ Image list updated!');
  } catch (err) {
    console.error('❌ Failed to update image list:', err.message);
    process.exit(1);
  }
})();
