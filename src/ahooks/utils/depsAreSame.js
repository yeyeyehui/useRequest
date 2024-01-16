/**
 * 比较两个对象是否发生变化
 * @param {*} oldDeps 旧对象
 * @param {*} newDeps 新对象
 * @returns 
 */
function depsAreSame(oldDeps, newDeps) {
  // 对象指向一样，两个对象没有变化
  if (oldDeps === newDeps) return true;

  // 钱比较
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], newDeps[i])) return false;
  }

  return true;
}

export default depsAreSame;
