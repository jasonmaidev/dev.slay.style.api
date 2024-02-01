import Style from "../models/Style.js"

/* CREATE */
export const createStyle = async (req, res) => {
  try {
    const { userId, name, headwear, shorttops, longtops, outerwear, onepiece, pants, shorts, footwear, occasions, isFavorite } = req.body
    const newStyle = new Style({
      userId,
      name,
      headwear,
      shorttops,
      longtops,
      outerwear,
      onepiece,
      pants,
      shorts,
      footwear,
      occasions,
      isFavorite
    })
    const empty = (!headwear && !shorttops && !longtops && !outerwear && !onepiece && !pants && !shorts && !footwear)
    if (empty) {
      res.status(400).send('A style should have at least 1 article of clothing.')
    } else {
      await newStyle.save()
      const styles = await Style.find()
      res.status(201).json(styles)
    }
  } catch (error) {
    res.status(409).json({ Message: error.message })
  }
}

// Get a user's style count
export const getStylesCount = async (req, res) => {
  try {
    const { userId } = req.params
    const totalStylesCount = await Style.find({ userId }).countDocuments()
    res.status(200).json(totalStylesCount)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

export const getStylesPageCount = async (req, res) => {
  try {
    const { userId } = req.params
    const pageSize = 4
    const stylesCount = await Style.find({ userId }).countDocuments();
    const totalPages = Math.ceil(stylesCount / pageSize)
    res.status(200).json(totalPages)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

// Get a user's style feed
export const getUserStyles = async (req, res) => {
  try {
    const { userId } = req.params
    const page = parseInt(req.query.page || "0")
    const pageSize = 4
    // const total = await Style.find({ userId }).countDocuments();
    const styles = await Style.find({ userId })
      .limit(pageSize)
      .skip(pageSize * page)
    // const data = {
    //   styles,
    //   totalPages: Math.ceil(total / pageSize)
    // }
    res.status(200).json(styles)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

export const getSuitableStyles = async (req, res) => {
  try {
    const { userId, sortByOccasion } = req.params // styleSort(api/routes) = sortByOccasion(client/state)
    const page = parseInt(req.query.page || "0")
    const pageSize = 4
    // Set dynamic query between 'favorite' and 'suitableFor' occasions based on StyleSortingButtons: SingleSelect
    const queryCondition = (sortByOccasion) => {
      switch (sortByOccasion) {
        case 'favorite':
          return { userId, isFavorite: true };
        default:
          return { userId, occasions: { $in: sortByOccasion } };
      }
    }
    const conditions = queryCondition(sortByOccasion)
    const styles = await Style.find(conditions)
      .limit(pageSize)
      .skip(pageSize * page)
    res.status(200).json(styles)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

export const getSuitableStylesCount = async (req, res) => {
  try {
    const { userId, sortByOccasion } = req.params
    const pageSize = 4
    const stylesCount = await Style.find({ userId, occasions: { $in: sortByOccasion } }).countDocuments()
    const totalPages = Math.ceil(stylesCount / pageSize)
    res.status(200).json(totalPages)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

// Get a style
export const getStyle = async (req, res) => {
  const _id = req.params.id
  try {
    const style = await Style.findOne({ _id })
    res.status(200).json(style)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

/* Update Style */
export const updateStyle = async (req, res) => {
  const allowedEdits = parseInt(req.params.dailyAllowedEdits)
  const guestUser = req.params.guestUser
  if (guestUser === "true" && allowedEdits < 1) {
    return res.status(429).send({ Message: "You've reached the daily allowed edits limit for guest accounts. Please try again when the refresh timer expires." })
  }

  const updates = await Object.keys(req.body)
  const alllowedUpdates = [
    'name',
    'headwear',
    'shorttops',
    'longtops',
    'outerwear',
    'onepiece',
    'pants',
    'shorts',
    'footwear',
    'occasions',
    'isFavorite'
  ]
  const isValidOperation = updates.every((update) => alllowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid operation' })
  }

  try {

    const { id } = req.params
    const style = await Style.findById(id)

    if (!style) {
      return res.status(404).send()
    }

    if (updates) {
      updates.forEach((update) => style[update] = req.body[update])
    }

    await style.save()
    res.send(style)
  }
  catch (error) {
    res.status(400).send(error)
  }
}

/* Delete Style */
export const deleteStyle = async (req, res) => {
  try {
    const style = await Style.findOneAndDelete({ _id: req.params.id })

    if (!style) {
      return res.status(404).json({ Message: "Style was not found!" })
    }
    res.send(style)
  } catch (error) {
    res.status(500).json({ Attention: error.message })
  }
}


