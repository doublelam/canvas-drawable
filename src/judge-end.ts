const ifHasTouch = (): boolean => {
  if (window.ontouchstart !== void 0) {
    return true;
  }
  return false;
};

export const ifMobile = ifHasTouch();
