"use strict";

//allowed filetypes
const mimetypes = ['image/png','image/jpg','image/jpeg','image/gif'];

/**
 * Sets the user's profile picture to the included file
 */
const create = (req, res) => {
    if(!req.files || !req.files.file || !mimetypes.includes(req.files.file.mimetype))
    return res.status(400).json({
        error: 'Bad Request',
        message: 'Wrong filetype'
    });
    const target_path = `${__dirname}/../../public/profile/${req.userID}.png`;
    //move the file to its target path
    req.files.file.mv(target_path, err => {
        if(err)
            return res.status(500).json({
                error: 'Internal Server Error',
                message: JSON.stringify(err)
            });
        return res.status(200).json({message: "Picture Uploaded"});
    });
};

module.exports = {
    create
};