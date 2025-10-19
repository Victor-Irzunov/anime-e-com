// transliteration.js
import CyrillicToTranslit from 'cyrillic-to-translit-js'

const cyrillicToTranslit = new CyrillicToTranslit();

export function transliterate(text) {
  return cyrillicToTranslit.transform(text);
}