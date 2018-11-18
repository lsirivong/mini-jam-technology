import _ from 'lodash'

export default function update(state, scene) {
  const { actors, player } = state

  _.each(actors, actor => {
    actor.update.call(actor, scene)
  })

  player.update.call(player, state, scene)
}
