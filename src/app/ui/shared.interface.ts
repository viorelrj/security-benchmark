export type FormControlType = 'ghost' | 'full';
export type FormControlHeight = 'sm' | 'md';
export type FormControlTheme = 'primary' | 'danger';

export interface IFormControl {
  type: FormControlType;
  height: FormControlHeight;
  theme: FormControlTheme;
}