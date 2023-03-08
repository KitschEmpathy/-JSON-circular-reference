/**
 * 对JSON循环结构进行编码
 */
function JsonDecycle(object, replacer) {
  const objects = new WeakMap();

  // 递归执行
  const derez = (value, path) => {
    let old_path, new_value;

    if (replacer !== undefined) {
      value = replacer(value);
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date) &&
      !(value instanceof Number) &&
      !(value instanceof RegExp)
    ) {
      old_path = objects.get(value);
      if (old_path !== undefined) {
        return { $ref: old_path };
      }

      objects.set(value, path);

      if (Array.isArray(value)) {
        new_value = [];
        value.forEach((element, i) => {
          new_value[i] = derez(element, `${path}[${i}]`);
        });
      } else {
        new_value = {};
        Object.keys(value).forEach((name) => {
          const val = value[name];
          new_value[name] = derez(val, `${path}[${JSON.stringify(name)}]`);
        })
      }
      return new_value;
    }
    return value;
  };

  return derez(object, "$");
}

/**
 * 恢复经过JsonDecycle处理的JSON循环结构
 */
export function JsonRetrocycle($) {
  const px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/; // eslint-disable-line

  // 递归遍历对象以查找 $ref 属性。 当它找到一个具有路径值的对象时，它会将 $ref 对象替换为对该路径找到的值的引用。
  function derez(value) {
    if (typeof value === "object" && value !== null) {
      const path = value.$ref;
      if (typeof path === "string" && px.test(path)) {
        return eval(path);
      } else {
        Object.keys(value).forEach((name) => {
          value[name] = derez(value[name]);
        })
        return value;
      }
    } else {
      return value;
    }
  }

  return derez($);
}
