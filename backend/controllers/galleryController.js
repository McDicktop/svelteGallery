const path = require("path");
const mongoose = require("mongoose");
const Gallery = require("../models/Gallery.js");
const deleteFileFromServer = require("../utils/deleteFileFromServer.js");

class GalleryController {
  async getImages(req, res) {
    try {
      const gallery = await Gallery.find();
      return res.status(200).send(gallery);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal server error",
        error: "SERVER_ERROR",
      });
    }
  }

  async getImageById(req, res) {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid image id",
        error: "INVALID_ID",
      });
    }

    try {
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          message: "Image not found",
          error: "CONTENT_MISSING",
        });
      }

      //   return res.status(200).send(image);
      return res.status(200).json({
        message: "Success",
        image,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal server error",
        error: "SERVER_ERROR",
      });
    }
  }

  async postImage(req, res) {
    try {
      const filename = await req?.file?.filename;

      if (!filename) {
        return res.status(404).json({
          message: "Get no file",
          error: "FILE_MISSING",
        });
      }

      let title;

      try {
        title = JSON.parse({ ...req.body }.content)?.title.trim();
      } catch (e) {
        return res.status(404).json({
          message: "Invalid JSON format or title missing in content",
          error: "INVALID_CONTENT",
        });
      }

      if (!title) {
        return res.status(404).json({
          message: "The title is missing",
          error: "MISSING_TITLE",
        });
      }

      const gallery = await Gallery.find();

      if (gallery.find((item) => item.title === title)) {
        return res.status(400).json({
          message: "The title is duplicated",
          error: "DUPLICATED_TITLE",
        });
      }

      const image = new Gallery({
        title,
        filename: `http://localhost:3000/cache/images/${filename}`,
      });

      await image.save();

      return res.status(200).send(image);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal server error",
        error: "SERVER_ERROR",
      });
    }
  }

 

  async deleteImage(req, res) {
    try {
      const { id, filename } = req.body;

      if (typeof id !== "string" || typeof filename !== "string") {
        return res.status(400).json({
          message: "Invalid filename or id",
          error: "DATA_INVALID",
        });
      }

      const imgDir = path.join(__dirname, "../cache/images/");

      const isImageDeletionSucces = await deleteFileFromServer(
        filename,
        imgDir
      );

      if (!isImageDeletionSucces.success) {
        return res.status(400).send({
          message: isImageDeletionSucces.message,
          error: "DELETION_ERROR",
        });
      }

      const image = await Gallery.findByIdAndDelete(id);

      if (!image) {
        return res.status(404).json({
          message: "Image not found",
          error: "CONTENT_MISSING",
        });
      }

      return res.status(200).json({
        message: "Deletion success",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal server error",
        error: "SERVER_ERROR",
      });
    }
  }
}

module.exports = { controller: new GalleryController() };
