const { controller } = require('../controllers/galleryController.js');

const upload = require('../utils/multer.js');

const handleMulterErrors = require('../middlewares/handleMulterErrors.js');

const Router = require('express');
const router = new Router();

router.get('/', controller.getImages);
router.get('/:id', controller.getImageById);
router.post('/', handleMulterErrors(upload.single("image")), controller.postImage);
// router.delete('/:id', controller.deleteImage);
router.delete('/', controller.deleteImage);

// router.delete('/file/:filename', controller.deleteFile);

module.exports = router;