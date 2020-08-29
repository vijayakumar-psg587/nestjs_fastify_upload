import * as dateFns from 'date-fns';
import {v4 as uuidv4} from 'uuid';
// const a = dateFns.format(Date.now(), '');
console.log('dd',process.cwd());
console.log('te:', 'localhost:3002'.includes('localhost'));
const a = ['ff', 'dd'];
console.log('aa:', {a:[...a].join(',')});
console.log(('8afc6d7d-fb6e-489b-838f-84bae41056bf' as any) instanceof uuidv4);
console.log(typeof ('8afc6d7d-fb6enp-489b-838f-84bae41056bf'));

// @ts-ignore
const entries = new Map();
entries.set('aa', 'ss');

// @ts-ignore
const obj = Object.fromEntries(entries);

console.log(obj);