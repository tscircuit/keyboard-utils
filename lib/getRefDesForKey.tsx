const refDesMap = {
  "~": "K_TILDE",
  "~`": "K_TILDE",
  "!": "K_EXCLAMATION",
  "@": "K_AT",
  "#": "K_HASH",
  $: "K_DOLLAR",
  "%": "K_PERCENT",
  "^": "K_CARET",
  "&": "K_AMPERSAND",
  "*": "K_ASTERISK",
  "(": "K_LPAREN",
  ")": "K_RPAREN",
  "{": "K_LBRACE",
  "}": "K_RBRACE",
  "|": "K_PIPE",
  "[": "K_LSQBRAK",
  "]": "K_RSQBRAK",
  '"': "K_QUOTE",
  "'": "K_SINGLEQUOTE",
  "<": "K_LT",
  ">": "K_GT",
  "?": "K_QUESTION",
  "/": "K_SLASH",
  windows: "K_WINDOWS",
  win: "K_WINDOWS",
  menu: "K_MENU",
  "caps lock": "K_CAPSLOCK",
  ":": "K_COLON",
  ";": "K_SEMICOLON",
  "1": "K_N1",
  "2": "K_N2",
  "3": "K_N3",
  "4": "K_N4",
  "5": "K_N5",
  "6": "K_N6",
  "7": "K_N7",
  "8": "K_N8",
  "9": "K_N9",
  "0": "K_N0",
  "-": "K_MINUS",
  "+": "K_PLUS",
  backspace: "K_BACKSPACE",
  tab: "K_TAB",
  " ": "K_SPACE",
  enter: "K_ENTER",
  shift: "K_SHIFT",
  ctrl: "K_CTRL",
  alt: "K_ALT",
  escape: "K_ESCAPE",
  arrowleft: "K_ARROW_LEFT",
  arrowright: "K_ARROW_RIGHT",
  arrowup: "K_ARROW_UP",
  arrowdown: "K_ARROW_DOWN",
  backquote: "K_BACKQUOTE",
  quote: "K_QUOTE",
  semicolon: "K_SEMICOLON",
  comma: "K_COMMA",
  period: "K_PERIOD",
  slash: "K_SLASH",
  backslash: "K_BACKSLASH",
  bracketleft: "K_BRACKET_LEFT",
  bracketright: "K_BRACKET_RIGHT",
  a: "K_A",
  b: "K_B",
  c: "K_C",
  d: "K_D",
  e: "K_E",
  f: "K_F",
  g: "K_G",
  h: "K_H",
  i: "K_I",
  j: "K_J",
  k: "K_K",
  l: "K_L",
  m: "K_M",
  n: "K_N",
  o: "K_O",
  p: "K_P",
  q: "K_Q",
  r: "K_R",
  s: "K_S",
  t: "K_T",
  u: "K_U",
  v: "K_V",
  w: "K_W",
  x: "K_X",
  y: "K_Y",
  z: "K_Z",
}

// Additional legends used by the bundled layouts. Entity names are case-sensitive:
// &dArr; and &darr; represent different arrows in the Planck layout.
const kleRefDesMap = new Map([
  ["scroll lock", "K_SCROLL_LOCK"],
  ["num lock", "K_NUM_LOCK"],
  ["back space", "K_BACKSPACE"],
  ["Back<br>Space", "K_BACKSPACE"],
  ["page up", "K_PGUP"],
  ["page down", "K_PGDN"],
  ["`", "K_BACKQUOTE"],
  [",", "K_COMMA"],
  [".", "K_PERIOD"],
  ["↑", "K_ARROW_UP"],
  ["↓", "K_ARROW_DOWN"],
  ["←", "K_ARROW_LEFT"],
  ["→", "K_ARROW_RIGHT"],
  ["&uarr;", "K_ARROW_UP"],
  ["&darr;", "K_ARROW_DOWN"],
  ["&larr;", "K_ARROW_LEFT"],
  ["&rarr;", "K_ARROW_RIGHT"],
  ["&uArr;", "K_DOUBLE_ARROW_UP"],
  ["&dArr;", "K_DOUBLE_ARROW_DOWN"],
  ["<i class='fa fa-eject'></i>", "K_EJECT"],
])

export const getRefDesForKey = (key: string): string => {
  const normKeyLabels = key.toLowerCase().split("\n")
  for (const normKeyLabel of normKeyLabels) {
    if (normKeyLabel in refDesMap) {
      return refDesMap[normKeyLabel as keyof typeof refDesMap]
    }
  }
  if (key === "") {
    return "K_SPACE"
  }
  // Keep all existing mapped legends ahead of these fallbacks, even when a
  // preceding legend is alphanumeric (for example, "F1\n!").
  for (const label of key.split("\n")) {
    // Only plain text aliases are case-insensitive. HTML and entity spellings
    // must exactly match a bundled legend rather than changing their meaning.
    const textAlias = /^[a-z ]+$/i.test(label)
      ? kleRefDesMap.get(label.toLowerCase())
      : undefined
    const refDes = kleRefDesMap.get(label) ?? textAlias
    if (refDes) return refDes
    if (label.match(/^[a-zA-Z0-9]+$/)) {
      return `K_${label.toUpperCase()}`
    }
  }
  throw new Error(`No defined refDes for key "${key}"`)
}
