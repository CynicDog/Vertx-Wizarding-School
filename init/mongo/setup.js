db.createCollection("user");
db.user.createIndex({username: 1}, {unique: true});
db.user.createIndex({emailAddress: 1}, {unique: true});
