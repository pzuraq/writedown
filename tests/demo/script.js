import tokenize from '../../src/-private/tokenize';
import parse from '../../src/-private/parser';
import renderer from '../../src/-private/renderer';

// import('../../crate/pkg').then(module => {
//   console.log(module.matchWordChars(TEXT));
// });
// tokeniz.greet();

let TEXT = `
[subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).
`;

// let TEXT = '[image:SFNoteIntro0_File0/Welcome@2x.jpg]';

// let TEXT = 'ao*eu_ao*eu_';

// let TEXT = '[and more](https://bear.app/faq/)';

let parsed = parse(TEXT);
console.log(parsed);

let rendered = parsed.map(n => renderer.renderNode(n)).join('');

console.log(rendered);

document.body.innerHTML = rendered;

document.addEventListener('keydown', ({ key }) => {
  TEXT += key;

  // console.log(TEXT);
  // console.log(parse(TEXT));
});

window.onmessage = () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
  document.body.style.background = '#F00';
};

window.postMessage('foo');
