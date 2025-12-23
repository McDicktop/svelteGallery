// const fs = require("fs").promises;
// const path = require("path");

// async function isFileExist(filePath) {
//     try {
//         await fs.access(filePath);
//         return true;
//     } catch (error) {
//         return error;
//     }
// }

// async function deleteFileFromServer(filename, uploadDirectory) {
//     const filePath = path.join(uploadDirectory, filename);

//     try {
//         const isExists = await isFileExist(filePath);

//         if (isExists instanceof Error) {
//             // console.log(isExists);
//             return {
//                 error: isExists,
//                 message: `File ${filename} not exists`
//             };
//         }

//         await fs.chmod(filePath, 0o666);
//         await fs.unlink(filePath);
//         return true;

//     } catch (error) {
//         // console.log(error);
//         return {
//             error,
//             message: `Error deleting file ${filename}`
//         }
//     }
// }

// module.exports = deleteFileFromServer;



const fs = require("fs").promises;
const path = require("path");
 
/**
 * Checks if a file exists and is acessible at the specified path and mode
 * @param {string} filePath - path to the file
 * @param {number} [mode=fs.constants.F_OK] - access mode to check
 * @returns {Promise<boolean>} - Resolves to true if file exists aand is accessible, false otherwise
 * @throws {TypeError} - If filepath is not a string
 * 
 * @example
 * const exists = await fileExists('/path/to/file.txt');
 * const isReadable = await fileExists('/path/to/file.txt', fs.constants.R_OK);
 */

async function fileExists(filePath, mode = fs.constants.F_OK) {
    if (typeof filePath !== 'string' || filePath.length === 0) {
        throw new TypeError('filePath must be a non-empty string');
    }

    try {
        await fs.access(filePath, mode);
        return true;
    } catch (error) {
        // ENOENT - file/dir не существует
        // EACCES - ошибка доступа 
        if(error.code === "ENOENT" || error.code === "EACCES") {
            return false;
        }

        throw error;
    }
}

/**
 * @returns {Promise<{success: boolean, message: string, error?: Error}>}
 */
async function deleteFileFromServer(filename, uploadDirectory) {
    if(!filename || typeof filename !== 'string') {
        return {
            success: false,
            message: 'Invalid filename provided',
        };
    };

    if(!uploadDirectory || typeof uploadDirectory !== 'string') {
        return {
            success: false,
            message: 'Invalid upload directory provided',
        };
    };

    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(uploadDirectory, sanitizedFilename);

    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(uploadDirectory);

    if(!resolvedPath.startsWith(resolvedUploadDir)) {
        return {
            success: false,
            message: 'Access denied: path traversal attempt detected',
        };
    }

    try {
        const exists = await fileExists(filePath);

        if(!exists) {
            return {
                success: false,
                message: `File ${sanitizedFilename} does not exist`,
            };
        }

        try {
            await fs.chmod(filePath, 0o666);
        } catch (chmodError) {
            console.warn(`chmod failed for ${sanitizedFilename}: `, chmodError.message)
        }

        // Если ошибка выше, то исполнение кода пойдет дальше и на следующей строке await точно выпадет с ошибкой? 


        await fs.unlink(filePath);

        return {
            success: true,
            message: `File ${sanitizedFilename} deleted successfully`
        }
    } catch (error) {
        return {
            success: false,
            message: `Failed to delete file ${sanitizedFilename}`,
            error: error
        }
    }
}

module.exports = deleteFileFromServer