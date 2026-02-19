const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  filterTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/", updateTask);
router.delete("/:id", deleteTask);
router.get("/filter", filterTask);

module.exports = router;
