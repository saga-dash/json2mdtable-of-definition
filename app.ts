import * as fs from "fs";

import { snakeToPascal } from "./util";

function isBaseType(type: string): boolean {
  if (type === undefined) {
    return undefined;
  }
  if (
    type === 'string' || 
    type === 'number' || 
    type === 'boolean' || 
    type === 'array' ||
    type.includes('array[string]') ||
    type.includes('array[number]') ||
    type.includes('array[boolean]')
  ) {
    return true;
  }
  return false;
}
function getObjectType(obj: any, key: any, parentKey?: string): string {
  if (obj[key] === undefined) {
    return undefined;
  }
  const type = typeof obj[key];
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return type;
    default:
    //object or array
      if (obj[key] instanceof Array) {
        const childType = getObjectType(obj[key], 0, key);
        if (childType === undefined) {
          return 'array';
        }
//        console.log("childType", childType);
        return `array[${childType}]`;
      }
      if (!isNaN(parseInt(key))) {
        if (!parentKey) {
          arrayObjectCount++;
        }
        return snakeToPascal(parentKey)||`ArrayObject${arrayObjectCount}`;
      }
      return snakeToPascal(key);
  }
}
var store: object = {};
var arrayObjectCount: number = 0;
function convertFlattening(obj: any, parentKey: string) {
  if (!obj) {
    return undefined;
  }
  const keys = Object.keys(obj);
  for (const key of keys) {
    const type = getObjectType(obj, key, parentKey);
    if (isNaN(parseInt(key))) {
      if (!store[parentKey]) {
        store[parentKey] = [];
      }
      store[parentKey].push({key: key, type: type});
    }
    if (!isBaseType(type)) {
      if (!isNaN(parseInt(key))) {
        convertFlattening(obj[key], parentKey);
        return store;
      }
      convertFlattening(obj[key], snakeToPascal(key));
    }
  }
  return store;
}
function convertJSON2MDTable(json: object, firstClassName?: string): string {
  const result = convertFlattening(json, firstClassName||"JSON");
//  console.log(result);
  const keys = Object.keys(result);
  let out = '';
  for (const key of keys) {
    out += `## ${key}\n\n`;
    out += `|Key|Description|Type|Formats|\n`;
    out += `|:-:|:-:|:-:|:-:|\n`;
    for (const ele of result[key]) {
      out += `|${ele.key}||${ele.type}||\n`;
    }
    out += `\n`;
  }
  return out;
}
function main() {
  if (process.argv.length <= 2) {
    console.log("plz JSONFilePath");
    return;
  }
  for(var i = 2;i < process.argv.length; i++){
//    console.log("argv[" + i + "] = " + process.argv[i]);
    const jsonStr = fs.readFileSync(process.argv[i]);
    const json = JSON.parse(jsonStr as any);
    const result = convertJSON2MDTable(json);
    console.log(result);
  }
}
if (!module.parent) {
  main();
}