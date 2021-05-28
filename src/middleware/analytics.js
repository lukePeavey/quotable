import moesifExpress from 'moesif-express'
import requestIp from 'request-ip'

const { MOESIF_APPLICATION_ID } = process.env

// Moesif middleware (API monitoring and analytics)
export default function moesifMiddleware() {
  if (MOESIF_APPLICATION_ID) {
    return moesifExpress({
      applicationId: MOESIF_APPLICATION_ID,
      // For now, use IP address to identify unique users
      identifyUser(req, res) {
        return requestIp.getClientIp(req)
      },
    })
  }
  return (req, res, next) => {
    return next()
  }
}
