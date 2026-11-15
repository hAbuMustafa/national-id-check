export default {
  title: 'Egyptian National ID Number Checker',
  nationalIdNumber: 'National ID Number',
  birthdate: 'Birthdate',
  age: 'Age',
  birthGov: 'Birth Governorate',
  gender: 'Gender',
  checksum: 'Checksum',
  incorrectNumber: 'Incorrect National ID Number',
  male: 'Male',
  female: 'Female',
  toggleLanguage: 'تغيير اللغة من الإنجليزية إلى العربية',
  whatIsThis: 'What is This?',
  about:
    'This tool helps checking the validity of an Egyptian National ID number, per the <a href="https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card#National_ID_description">open data available online</a> and validating the check digit against the <a href="https://github.com/hAbuMustafa/national-id-check/blob/main/src/lib/utils/validator.ts#L12">special formula</a>. This tool DOES NOT fetch the corresponding citizen data from any authority, nor report the number to any third party server, nor validate it against official records. All processing operation of the provided number happen instantaneously on YOUR machine, nothing is sent outside the bounds of your machine, or kept elsewhere for further processing, for the privacy of your operations.',
  bookmarkletInstructions:
    'Add following script to your browsers bookmarks so you can do the check from anywhere:',
  copy: 'Copy to clipboard',
};
