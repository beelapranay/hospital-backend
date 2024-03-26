const express = require('express');
const app = express();

var users = [{
    name: "John",
    age: 25,
    kidneys: [{
        healthy: true
    }, {
        healthy: false
    }]
}, {
    name: "Doe",
    age: 30,
    kidneys: [{
        healthy: true
    }, {
        healthy: true
    }]
}];

function countUnhealthyKidneys(id) {
    let unhealthyKidneys = 0;

    for(let i = 0; i < users[id].kidneys.length; i++) {
        if(!users[id].kidneys[i].healthy) {
            unhealthyKidneys += 1;
        }
    }

    return unhealthyKidneys;
}

function userPresent(user) {
    for(let i = 0; i < users.length; i++) {
        if(user.toLowerCase() === users[i].name.toLowerCase()) {
            return i;
        }
    }

    return -1;
}

function countHealthyKidneys(id) {
    let healthyKidneys = 0;

    for(let i = 0; i < users[id].kidneys.length; i++) {
        if(users[id].kidneys[i].healthy) {
            healthyKidneys += 1;
        }
    }

    return healthyKidneys;
}

function addKidney(id, isHealthy) {
    users[id].kidneys.push({
        healthy: isHealthy
    });
}

function replaceKidney(id) {
    const unhealthyKidneys = countUnhealthyKidneys(id);

    if(unhealthyKidneys > 0) {
        for(let i = 0; i < users[id].kidneys.length; i++) {
            if(!users[id].kidneys[i].healthy) {
                users[id].kidneys[i].healthy = true;
            }
        }
    }
}

function removeKidney(id) {
    const newKidneys = [];
    const unhealthyKidneys = countUnhealthyKidneys(id);

    if(unhealthyKidneys > 0) {
        for(let i = 0; i < users[id].kidneys.length; i++) {
            if(users[id].kidneys[i].healthy) {
                newKidneys.push({
                    healthy: true
                });
            }
        }
    }

    users[id].kidneys = newKidneys;
}

app.use(express.json());

app.get('/', (req, res) => {
    const user = req.query.user;
    const id = userPresent(user);

    if(id !== -1) {
        res.status(200).json({
            numberOfKidneys: users[id].kidneys.length,
            numberOfHealthyKidneys: countHealthyKidneys(id),
            numberOfUnhealthyKidneys: countUnhealthyKidneys(id)
        })
    } else {
        res.statusCode = 411;
        res.send("The provided user does not exist!");
    }

});

app.post('/', (req, res) => {
    const user = req.query.user;
    const id = userPresent(user);
    const kidney = req.body.isHealthy;

    if(id !== -1) {
        addKidney(id, kidney);
        res.status(200).json({
            message: "Done!"
        });
    } else {
        res.status(411).send("The provided user does not exist!");
    }
});

app.put('/', (req, res) => {
    const user = req.query.user;
    const id = userPresent(user);

    if(id !== -1) {
        replaceKidney(id);
        res.status(200).json({
            message: "Done!"
        });
    } else {
        res.status(411).send("The provided user does not exist!");
    }
});

app.delete('/', (req, res) => {
    const user = req.query.user;
    const id = userPresent(user);

    if(id !== -1) {
        removeKidney(id);
        res.status(200).json({
            message: "Done!"
        });
    } else {
        res.status(411).send("The provided user does not exist!")
    }
});

app.listen(3000)