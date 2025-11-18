const getOverview = (req, res,) => {
  res.status(200).render('overview', {
    title: 'tours'
  })
}

const getTour = (req, res,) => {
  res.status(200).render('tour', {
    title: 'forest hiker'
  })
}
export default { getOverview, getTour }