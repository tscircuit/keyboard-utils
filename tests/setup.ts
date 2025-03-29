// Mock JSX implementation for tests
globalThis.React = {
  createElement: (type: any, props: any, ...children: any[]) => {
    return { type, props, children };
  }
};

// Mock Key component
globalThis.Key = ({ name }: { name: string }) => {
  return { type: "Key", props: { name } };
};

// Mock A_1N4148WS component
globalThis.A_1N4148WS = (props: any) => {
  return { type: "A_1N4148WS", props };
};

// Mock trace component
globalThis.trace = (props: any) => {
  return { type: "trace", props };
};

// Mock group component
globalThis.group = (props: any) => {
  return { type: "group", props };
};