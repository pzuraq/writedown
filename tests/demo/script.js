import tokenize from '../../src/-private/tokenize';
import parse from '../../src/-private/parser';

// import('../../crate/pkg').then(module => {
//   console.log(module.matchWordChars(TEXT));
// });
// tokeniz.greet();

let TEXT = `
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]

##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]

##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]

##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]##

Welcome to Bear
[image:SFNoteIntro0_File0/Welcome@2x.jpg]

is a beautiful, _*/flexible app for crafting notes and*/ prose. It’s easy_ to get started and master Bear, so we’ll show you around . *
You can also [subscribe to our monthly newsletter] (_aoeu_)eepurl.com/dvs38P for tips, interviews, news, [and more](https://bear.app/faq/).

## Bear has three parts 🐻
Bear has three main columns where you create, edit, and organize your notes.

[image:SFNoteIntro0_File1/Bear 3 columns.png]
`;

document.addEventListener('keydown', ({ key }) => {
  TEXT += key;

  console.log(tokenize(TEXT));
});
