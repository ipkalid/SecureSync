db = db.getSiblingDB('admin');
    if (db.system.users.find({user: "root"}).count() == 0) {
      db.createUser({
        user: "root",
        pwd: "example",
        roles: [ { role: "root", db: "admin" }, { role: "readWrite", db: "policiesconfig" } ]
      });
    }
    db = db.getSiblingDB('policiesconfig');
    db.policies.drop();
    db.policies.insertMany(require('/docker-entrypoint-initdb.d/01_policies.json'));
    db.appsPackages.drop();
    db.appsPackages.insertMany(require('/docker-entrypoint-initdb.d/02_appsPackages.json'));
    db.customConfigurations.drop();
    db.customConfigurations.insertMany(require('/docker-entrypoint-initdb.d/03_customConfigurations.json'));
    db.deviceSettings.drop();
    db.deviceSettings.insertMany(require('/docker-entrypoint-initdb.d/04_deviceSettings.json'));