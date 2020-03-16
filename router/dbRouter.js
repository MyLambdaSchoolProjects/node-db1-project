const express = require("express");

const knex = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "Nope" });
    });
});

router.get("/:id", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    // .where("id", "=", req.params.id)
    .where({ id: req.params.id })
    .first() // equivalent to posts[0]
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the post" });
    });
});

router.post("/", (req, res) => {
  const accData = req.body;
  knex("accounts")
    .insert(accData, "id")
    .then(ids => {
      const id = ids[0];
      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(post => {
          res.status(201).json(post);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error adding the post"
      });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  knex("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error updating the account"
      });
    });
});

router.delete("/:id", (req, res) => {
  knex("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) removed` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error removing the account"
      });
    });
});

module.exports = router;
