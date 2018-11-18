import _ from 'lodash'

function pickCable(deltaX, deltaY, lastMove) {
  const lastDeltaX = _.get(lastMove, 0)
  const lastDeltaY = _.get(lastMove, 1)

  if (lastDeltaY === 1) {
    // last moved down
    if (deltaY === 1) {
      return 28
    } else if (deltaX === 1) {
      return 36
    } else if  (deltaX === -1) {
      return 38
    }
  } else if (lastDeltaY === -1) {
    // last moved up
    if (deltaY === -1) {
      return 28
    } else if (deltaX === 1) {
      // right
      return 20
    } else if  (deltaX === -1) {
      // left
      return 22
    }
  } else if (lastDeltaX === 1) {
    // last moved right
    if (deltaY === -1) {
      // up
      return 38
    } else if (deltaY === 1) {
      // down
      return 22
    } else if (deltaX === 1) {
      // right
      return 21
    }
  } else if (lastDeltaX === -1) {
    // last moved left
    if (deltaY === -1) {
      // up
      return 36
    } else if (deltaY === 1) {
      // down
      return 20
    } else if (deltaX === -1) {
      // left
      return 21
    }
  } else {
    // no previous
    if (deltaY === 1) {
      // down
      return 44
    } else if (deltaY === -1) {
      return 45
    } else if (deltaX === -1) {
      return 46
    } else if (deltaX === 1) {
      // left or right
      return 47
    }
  }
}

export default pickCable
