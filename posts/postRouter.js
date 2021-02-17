const express = require('express');

const router = express.Router();

const db = require('./postDb');


router.get('/', (req, res) => {
  // do your magic!
  db.get()
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log("GET to root failed:", err)
    res.status(500).json({ error: "The posts information could not be retrieved." })
})
});

router.get('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id

  db.getById(id)
    .then(post => {
      if (post.id) {
        res
          .status(200)
          .json(post)
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    })
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;

  db.remove(id)
    .then(deleted => {
      if (deleted > 0) {
        res
          .status(200)
          .json(deleted)
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
        res
          .status(500)
          .json({ error: "The post could not be removed." })
    })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const post = req.body;
  const id = req.params.id; 

  if (!post.text || !post.user_id) {
     return res.status(400).json({ errorMessage: "Please provide text and user id for the post." })
  } else {
    db.update(id, post)
      .then(updated => {
        if (updated === 1) {
          db.getById(id)
            .then(post => {
              res
                .status(200)
                .json(post)
            })
            .catch(err => {
              res
                .status(500)
                .json({ errorMessage: "The post with the specified ID does not exist." })
            })
        } else {
          res
            .status(404)
            .json({ errorMessage: "The post with the specified ID does not exist." })
        }
      })
      .catch(err => {
          res
            .status(500)
            .json({ error: "The post information could not be modified." })
      })
  }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const body = req.body;

  if(!body) {
    return res.status(400).json({  message: "missing post data" })
  } else if (!body.text) {
    return res.status(400).json({  message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;