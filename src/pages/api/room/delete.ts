import { prisma } from "@/services/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { createOptions } from "../auth/[...nextauth]";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, createOptions(req));

  if (!session) {
    res.status(401);
    throw new Error("Not authorized");
  }
  if (req.method === "DELETE") {
    try {
      const { roomId } = req.query;
      const room = await prisma.room.delete({
        where: {
          id: roomId.toString(),
        },
      });
      await stripe.products.del(room.stripeProductId);
      return res.status(201).json({ message: "Delete successfully" });
    } catch (error) {
      return res.status(401).json({ errors: "Fail to delete" });
    }
  }
};

export default handler;
