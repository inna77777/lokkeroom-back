const { Pool } = require("pg");

const pool = new Pool({
  user: "ue73hnca7qflqs",
  password: "pefb246349c5f81b5d05d52b9d4e93e5b232229b331a909377c921ce574fe2981",
  host: "cdgn4ufq38ipd0.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com",
  database: "dbs5m0dggne3qf",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
