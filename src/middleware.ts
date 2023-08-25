import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log(`[LOG] USER WITH USERNAME ${req.nextauth.token?.username} HAS BEEN PROCESSED`)
  }
  
)

export const config = { matcher: ["/"] }