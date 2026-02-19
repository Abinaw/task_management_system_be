const prisma = require("../config/db");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, userId } = req.body;
    debugger;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        ...(userId && { userId: parseInt(userId) }),
      },
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        orderBy: { updatedAt: "desc" },
        skip,
        take: size,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.task.count(),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
        hasNextPage: page < Math.ceil(total / size),
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id, title, description, status, priority, userId } = req.body;

    const existing = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...("userId" in req.body && {
          userId: userId ? parseInt(userId) : null,
        }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findFirst({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

const filterTask = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;

    const { priority, status } = req.query;

    const statusFilter = status
      ? status.split(",").map((s) => s.trim())
      : undefined;
    const priorityFilter = priority
      ? priority.split(",").map((p) => p.trim())
      : undefined;

    const where = {
      ...(statusFilter && { status: { in: statusFilter } }),
      ...(priorityFilter && { priority: { in: priorityFilter } }),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: size,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
        hasNextPage: page < Math.ceil(total / size),
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, filterTask };
