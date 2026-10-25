// Loads the bundled variable fonts via staticFile and blocks rendering
// (delayRender) until they are ready — the Remotion-recommended pattern.
import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;

export const initFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('loading fonts');
  const faces: [string, string, string][] = [
    ['Plus Jakarta Sans', staticFile('fonts/PJS-400.woff2'), '100 900'],
    ['JetBrains Mono', staticFile('fonts/JBM-400.woff2'), '100 800'],
  ];
  Promise.all(
    faces.map(async ([family, url, weight]) => {
      const face = new FontFace(family, `url(${url})`, {weight, display: 'block'});
      const loaded = await face.load();
      (document as unknown as {fonts: {add: (f: FontFace) => void}}).fonts.add(loaded);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      // Never hard-block a render on font failure — system fallback applies.
      // eslint-disable-next-line no-console
      console.warn('font load failed, using fallback', err);
      continueRender(handle);
    });
};
