const fs = require('fs');
const path = require('path');

const directoryPath = './';  // Replace with your directory path

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to read directory: ' + err);
    }

    files.forEach(file => {
        if (file.endsWith('.json')) {
            const oldPath = path.join(directoryPath, file);
            const newPath = path.join(directoryPath, file.slice(0, -5));  // Removes the last 5 characters (.json)

            fs.rename(oldPath, newPath, function(err) {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log(`Renamed ${oldPath} to ${newPath}`);
                }
            });
        }
    });
});