export function createInput(canvas) {
  const actions = new Set();
  let throttle = 0;
  let pitch = 0;
  let roll = 0;
  const keyMap = {
    'ArrowUp': 1,
    'ArrowDown': -1,
    'ArrowLeft': 1,
    'ArrowRight': -1,
    'a': -1,
    'd': 1,
    'w': 1,
    's': -1,
    'Shift': 1,
    'Control': -1,
    'p': 'pause',
    'r': 'restart',
    'Enter': 'start',
  };
  function handleKey(e) {
    const key = e.key;
    if (keyMap[key] !== undefined) {
      if (keyMap[key] === 'pause') {
        actions.add('pause');
      } else if (keyMap[key] === 'restart') {
        actions.add('restart');
      } else if (keyMap[key] === 'start') {
        actions.add('start');
      } else {
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 's') pitch = keyMap[key];
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'a' || key === 'd') roll = keyMap[key];
        if (key === 'Shift') throttle = 1;
        if (key === 'Control') throttle = -1;
      }
    }
  }
  function release(e) {
    const key = e.key;
    if (keyMap[key] !== undefined) {
      if (keyMap[key] === 'pause') actions.delete('pause');
      else if (keyMap[key] === 'restart') actions.delete('restart');
      else if (keyMap[key] === 'start') actions.delete('start');
      else {
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 's') pitch = 0;
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'a' || key === 'd') roll = 0;
        if (key === 'Shift') throttle = 0;
        if (key === 'Control') throttle = 0;
      }
    }
  }
  canvas.addEventListener('keydown', handleKey);
  canvas.addEventListener('keyup', release);
  return {
    getPitch: () => pitch,
    getRoll: () => roll,
    getThrottle: () => throttle,
    takeActions: () => {
      const a = Array.from(actions).join('');
      actions.clear();
      return a;
    },
  };
}
