import _ from 'lodash'

export default function update(state, scene) {
  const { actors } = state

  _.each(actors, actor => {
    actor.update.call(actor, scene)
  })
}
