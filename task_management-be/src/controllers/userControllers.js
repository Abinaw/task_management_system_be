const prisma = require("../config/db");

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers };
