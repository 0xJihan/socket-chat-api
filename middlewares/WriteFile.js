const fs = require('fs');
const { v4: uuid } = require("uuid");

const writeFile = (directory, buffer) => {

    return (req, res) => {

        //! Unique file name
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = uuid() + '.' + fileExtension;

        //! Directory and File path
        const directoryPath = `/opt/lampp/htdocs/${directory}`;
        const filePath = `${directoryPath}/${fileName}`;


        //! Creating directory if not exists
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, {recursive: true});
        }

        //! Writing file to the directory
        fs.writeFile(filePath, buffer, (err) => {

            if (err) {
                console.error(err);
                return res.status(400).json({message: "File upload failed", success: false});
            }
        });

        req.filePath = `${directory}/${fileName}`;

    }


};

module.exports = {writeFile};