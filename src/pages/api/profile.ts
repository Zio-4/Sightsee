import { NextApiRequest, NextApiResponse } from "next";
import { validateRoute } from "../../lib/auth";
import { prisma } from '../../server/db/client'
import { getAuth } from "@clerk/nextjs/server";

export default validateRoute(async function (
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
  ): Promise<void> {
  
    switch (req.method) {
      case 'PUT':
        try {
            const data = await prisma.profile.update({
                where: { clerkId: userId},
                data: {
                    bio: req.body.bio,
                    distanceUnits: req.body.distanceUnits,
                    dateFormat: req.body.dateFormat,
                    timeFormat: req.body.timeFormat,
                    commentsNotification: req.body.commentsNotification,
                    remindersNotification: req.body.remindersNotification,
                    collaboratorJoinedNotification: req.body.collaboratorNotification,
                },
            })
            res.status(200).json(data)
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'An error occured while updating the data.'})
        }
        break
      case 'DELETE':
        try {
            // delete's user, accounts, sessions, itineraries, tripdays, and activities due to onDelete: Cascade referential action in schema
            await prisma.profile.delete({
                where: { clerkId: userId }
            })

            res.status(204).json({ message: "Resource successfully deleted" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'An error occured trying to delete the account'})
        }
        break
      default:
        return res.status(501).json({
            error: {
            code: 'method_unknown',
            message: 'This endpoint only responds to PUT, and DELETE',
            },
        });
    }
})