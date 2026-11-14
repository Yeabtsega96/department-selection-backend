import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Check whether a valid session exists
    if (!session) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

     // Check whether the account is active
    if(session.user.isActive === false) {
        res.status(403).json({
            success: false,
            message: "Your account is inactive. Please contact support.",
        }
        )
    }

    // Make user and session available to controllers
    req.user = session.user;
    req.session = session.session;

    next()
  } catch (error) {
    next(error);
  }
}
