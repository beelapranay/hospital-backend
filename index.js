const express = require("express");
const app = express();

var users = [{
    name: "john",
    kidneys: [{
        healthy: false
    }]
}];

function checkForUnhealthyKidneys() {
    let checkFor = false;
        
    for(let i = 0; i < users[0].kidneys.length; i++) {
        if(!users[0].kidneys[i].healthy) {
                checkFor = true;
        }
    }

    return checkFor;
}

const hasUnhealthyKidneys = checkForUnhealthyKidneys();

app.use(express.json());

app.get('/', (req, res) => {
    const johnKidneys = users[0].kidneys;
    const numberOfKidneys = johnKidneys.length;
    let numberOfHealthyKidneys = 0;

    for(let i = 0; i < johnKidneys.length; i++) {
        if(johnKidneys[i].healthy) {
            numberOfHealthyKidneys += 1;
        }
    }

    const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;

    res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnhealthyKidneys
    });
});

app.post('/', (req, res) => {
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
        healthy: isHealthy
    });

    res.json({
        message: "Done!"
    });
});

app.put('/', (req, res) => {
    if(hasUnhealthyKidneys) {
        for(let i = 0; i < users[0].kidneys.length; i++) {
        users[0].kidneys[i].healthy = true;
        }
        res.json({
            message: "Updated!"
        });
    } else {
        res.status(411).json({
            message: "You have no unhealthy kidneys!"
        });
    }
});

app.delete('/', (req, res) => {
    if(hasUnhealthyKidneys) {
        const newKidneys = [];

        for(let i = 0; i < users[0].kidneys.length; i++) {
            if(users[0].kidneys[i].healthy) {
                newKidneys.push({
                    healthy: true
                });
            }
        }

        users[0].kidneys = newKidneys;

        res.json({
            message: "Done!"
        });
    } else {
        res.status(411).json({
            message: "You have no bad kidneys!"
        });
    }
});

app.listen(3000, () => {
    console.log('server is up & running!');
});