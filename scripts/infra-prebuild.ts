import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const LANGS_PATH = resolve(__dirname, '..', 'infra', 'util', 'languages.json');
const BICEP_PATH = resolve(__dirname, '..', 'infra', 'util', 'lang.bicep');

const langs = JSON.parse(readFileSync(LANGS_PATH, 'utf8'));

const supportedLanguages = Object.keys(langs);

const supportedLanguageType = supportedLanguages
    .map(lang => `'${lang}'`)
    .join(' | ');

const langBicep = readFileSync(BICEP_PATH, 'utf8');

const updatedLangBicep = langBicep.replace("'en'", supportedLanguageType);

writeFileSync(BICEP_PATH, updatedLangBicep);
