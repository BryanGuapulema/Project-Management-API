export const successResponse = (res, data, statusCode = 200, options = {}) => {
  const { access_token, accessCookieOptions, refresh_token, refreshCookieOptions } = options

  if (access_token) res.cookie('access_token', access_token, accessCookieOptions)
  if (refresh_token) res.cookie('refresh_token', refresh_token, refreshCookieOptions)

  res.status(statusCode).json({
    success: true,
    data,
  })
}
