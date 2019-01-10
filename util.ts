
/*--- スネークケースをキャメルケースにする ---*/
// 引数 p = camel_case
// 返値 文字列(camelCase)
export function snakeToCamel(text: string): string {
  if (!text) {
    return undefined;
  }
  //_+小文字を大文字にする(例:_a を A)
  return text.replace(/_./g,
    function(s) {
      return s.charAt(1).toUpperCase();
    }
  );
};
/*--- キャメルケースをスネークケースにする ---*/
// 引数 p = camelCase
// 返値 文字列(camel_case)
export function camelToSnake(text: string): string {
  if (!text) {
    return undefined;
  }
  //大文字を_+小文字にする(例:A を _a)
  return text.replace(/([A-Z])/g,
    function(s) {
      return '_' + s.charAt(0).toLowerCase();
    }
  );
};

export function snakeToPascal(text: string): string {
  if (!text) {
    return undefined;
  }
  const camel = snakeToCamel(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}