import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BICEP_PATH = resolve(__dirname, '..', 'infra', 'util', 'lang.bicep');

const BICEP_CONTENT = `
@export()
type SupportedLanguage = 'en'
`.trimStart();

writeFileSync(BICEP_PATH, BICEP_CONTENT);
