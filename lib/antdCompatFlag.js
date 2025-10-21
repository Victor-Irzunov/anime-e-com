// /lib/antdCompatFlag.js
// Ставит флаг, который выключает предупреждение antd под React 19.
// Выполняется и на сервере, и в браузере.

if (typeof globalThis !== "undefined") {
  // сервер и браузер
  // eslint-disable-next-line no-undef
  globalThis.ANTD_DISABLE_REACT_19_WARNING = true;
}
if (typeof window !== "undefined") {
  window.ANTD_DISABLE_REACT_19_WARNING = true;
}
