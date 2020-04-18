import test from 'ava'
import { createVueSyncInstance } from './helpers/createVueSyncInstance'
import { bulbasaur, flareon } from './helpers/pokemon'
import { waitMs } from './helpers/wait'

test('read: stream (collection)', async t => {
  const { pokedexModule } = createVueSyncInstance()
  t.deepEqual(pokedexModule.data.get('001'), bulbasaur)
  t.deepEqual(pokedexModule.data.size, 1)
  const streamPayload = {}
  // do not await, because it only resolves when the stream is closed
  pokedexModule.stream(streamPayload).catch(e => t.fail(e.message)) // prettier-ignore
  await waitMs(600)
  // close the stream:
  const unsubscribe = pokedexModule.openStreams[JSON.stringify(streamPayload)]
  unsubscribe()
  t.deepEqual(pokedexModule.data.get('001'), bulbasaur)
  t.deepEqual(pokedexModule.data.get('136'), flareon)
  t.deepEqual(pokedexModule.data.size, 2)
  await waitMs(1000)
  t.deepEqual(pokedexModule.data.size, 2)
  // '004': charmander should come in 3rd, but doesn't because we closed the stream
})

test('read: stream (doc)', async t => {
  const { trainerModule } = createVueSyncInstance()
  t.deepEqual(trainerModule.data, { name: 'Luca', age: 10 })
  const streamPayload = {}
  // do not await, because it only resolves when the stream is closed
  trainerModule.stream(streamPayload).catch(e => t.fail(e.message)) // prettier-ignore
  await waitMs(600)
  // close the stream:
  const unsubscribe = trainerModule.openStreams[JSON.stringify(streamPayload)]
  unsubscribe()
  t.deepEqual(trainerModule.data, { name: 'Luca', age: 10, dream: 'job' })
  await waitMs(1000)
  t.deepEqual(trainerModule.data, { name: 'Luca', age: 10, dream: 'job' })
  // {colour: 'blue'} should come in 3rd, but doesn't because we closed the stream
})