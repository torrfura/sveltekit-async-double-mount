// Running total of destination +page mounts since page load, shown in the nav
// bar so the double-mount is visible without opening the console.
export const counter = $state({ destMounts: 0 });
