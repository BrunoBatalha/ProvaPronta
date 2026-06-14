import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createActivity,
  removeActivity,
  updateActivity,
  validateActivityImage,
} from '../src/lib/activityUtils.js'

test('createActivity creates an empty activity with the provided id', () => {
  assert.deepEqual(createActivity(() => 'activity-id'), {
    id: 'activity-id',
    statement: '',
    image: undefined,
  })
})

test('updateActivity changes only the selected activity', () => {
  const firstActivity = createActivity(() => 'first')
  const secondActivity = createActivity(() => 'second')

  const result = updateActivity(
    [firstActivity, secondActivity],
    'second',
    { statement: 'Pinte o desenho.' },
  )

  assert.equal(result[0], firstActivity)
  assert.deepEqual(result[1], {
    ...secondActivity,
    statement: 'Pinte o desenho.',
  })
})

test('removeActivity removes only the activity with the selected id', () => {
  const firstActivity = createActivity(() => 'first')
  const secondActivity = createActivity(() => 'second')

  assert.deepEqual(removeActivity([firstActivity, secondActivity], 'first'), [
    secondActivity,
  ])
})

test('validateActivityImage accepts PNG and JPEG images up to 5 MB', () => {
  const pngFile = new File(['image'], 'atividade.png', {
    type: 'image/png',
  })
  const jpegFile = new File(['image'], 'atividade.jpg', {
    type: 'image/jpeg',
  })

  assert.equal(validateActivityImage(pngFile), undefined)
  assert.equal(validateActivityImage(jpegFile), undefined)
})

test('validateActivityImage accepts a valid extension when MIME type is missing', () => {
  const jpegFile = new File(['image'], 'atividade.jpeg')

  assert.equal(validateActivityImage(jpegFile), undefined)
})

test('validateActivityImage rejects unsupported image formats', () => {
  const gifFile = new File(['image'], 'atividade.gif', {
    type: 'image/gif',
  })

  assert.equal(
    validateActivityImage(gifFile),
    'Use uma imagem em PNG, JPG ou JPEG.',
  )
})

test('validateActivityImage rejects images larger than 5 MB', () => {
  const largeFile = new File(
    [new Uint8Array(5 * 1024 * 1024 + 1)],
    'atividade.png',
    { type: 'image/png' },
  )

  assert.equal(
    validateActivityImage(largeFile),
    'Essa imagem é muito grande. Envie uma imagem de até 5 MB.',
  )
})
