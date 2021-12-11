const csv = require('csv-parser');
const fs = require('fs');
const results = [];

function qualifiedClients(file, n) {
    fs.createReadStream(__dirname + '/' + file)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const customerIDs = results.map((result) => {
                return result['Customer ID'];
            });
            const obj = {};
            for (i = 0; i < customerIDs.length; i++) {
                let customerID = customerIDs[i];

                if (obj[customerID]) {
                    obj[customerID]++;
                } else {
                    obj[customerID] = 1;
                }
            }

            // Creating a final arr for the obj for easy manipulation of data
            const finalArr = [];
            for (const x in obj) {
                const newObj = {};
                newObj.id = x;
                newObj.count = obj[x];
                finalArr.push(newObj);
            }

            //sorting the customer IDs in order of the count of transactions
            finalArr.sort((a, b) => {
                if (a.count > b.count) {
                    return -1;
                } else if (a.count < b.count) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Extracting the IDs only
            const finalIdsArr = finalArr.map((obj) => obj.id);

            // Getting the IDs based on the number requested by the user
            console.log(finalIdsArr.slice(0, n));
        })
        .on('error', () => {
            console.log('An error occurred');
        });
}

// Insert the number of results you want in the second parameter, and the file in the first
qualifiedClients('transaction_data_2.csv', 1);
