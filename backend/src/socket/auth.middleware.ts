import * as cookie from "cookie";
import authenticate from "../features/auth/authenticate";
import { Socket } from "socket.io";

async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) {
    const error = new Error("Authentication error: No cookies provided");
    return next(error);
  }

  const cookies = cookie.parseCookie(cookieHeader);
  const token = cookies.accessToken;

  if (!token) {
    return next(new Error("Authentication error: Access token missing"));
  }

  try {
    const user = await authenticate(token);
    socket.user = user;
    next();
  } catch (authError) {
    next(
      authError instanceof Error
        ? authError
        : new Error("Authentication failed"),
    );
  }
}

export default authenticateSocket;
