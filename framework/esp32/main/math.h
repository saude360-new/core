#ifndef _SAUDE360_MATHLIB_H_
#define _SAUDE360_MATHLIB_H_

int integer_clamp(int val, int min, int max) {
  if(val < min) return min;
  if(val > max) return max;
  return val;
}

float float_clamp(float val, float min, float max) {
  if(val < min) return min;
  if(val > max) return max;
  return val;
}

double double_precision_clamp(double val, double min, double max) {
  if(val < min) return min;
  if(val > max) return max;
  return val;
}

#endif;