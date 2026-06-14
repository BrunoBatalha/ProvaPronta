import assert from 'node:assert/strict'
import test from 'node:test'
import { validateHeaderImage } from '../src/lib/headerImageUtils.js'

test('validateHeaderImage accepts PNG and JPEG images up to 2 MB', () => {
  const pngFile = new File(['image'], 'cabecalho.png', {
    type: 'image/png',
  })
  const jpegFile = new File(['image'], 'cabecalho.jpg', {
    type: 'image/jpeg',
  })

  assert.equal(validateHeaderImage(pngFile), undefined)
  assert.equal(validateHeaderImage(jpegFile), undefined)
})

test('validateHeaderImage accepts a valid extension when MIME type is missing', () => {
  const jpegFile = new File(['image'], 'cabecalho.jpeg')

  assert.equal(validateHeaderImage(jpegFile), undefined)
})

test('validateHeaderImage rejects unsupported image formats', () => {
  const gifFile = new File(['image'], 'cabecalho.gif', {
    type: 'image/gif',
  })

  assert.equal(
    validateHeaderImage(gifFile),
    'Use uma imagem em PNG, JPG ou JPEG.',
  )
})

test('validateHeaderImage rejects images larger than 2 MB', () => {
  const largeFile = new File(
    [new Uint8Array(2 * 1024 * 1024 + 1)],
    'cabecalho.png',
    { type: 'image/png' },
  )

  assert.equal(
    validateHeaderImage(largeFile),
    'Essa imagem é muito grande. Envie uma imagem de até 2 MB.',
  )
})
