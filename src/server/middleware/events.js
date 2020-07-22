import events from './events.json'

export default (req, res) => {
  if (req.query.eventTypeId) {
    return res.status(501).json({
      success: false,
      error: {
        message: 'eventTypeId filter not yet implemented'
      }
    })
  }

  res.json({
    success: true,
    results: {
      events
    }
  })
}
