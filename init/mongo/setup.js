db.createCollection("user");
db.user.createIndex({username: 1}, {unique: true});
db.user.createIndex({emailAddress: 1}, {unique: true});

db.createCollection("house");
db.house.insertMany([
    {
        title: "Gryffindor",
        quota: 100,
        points: 500,
    },
    {
        title: "Slytherin",
        quota: 90,
        points: 480,
    },
    {
        title: "Ravenclaw",
        quota: 95,
        points: 460,
    },
    {
        title: "Hufflepuff",
        quota: 80,
        points: 420,
    },
]);
db.house.createIndex({ title: 1 }, { unique: true });