import { describe, it, expect } from 'vitest';
import { getLuminance, parseColor } from '../color-transform';
import { newevenLight, newevenDark } from '../neweven-theme';
import { BUILTIN_THEMES } from '../builtin-themes';
function contrast(a: string,b: string) {
  const rgbA=parseColor(a)!; const rgbB=parseColor(b)!;
  const x=getLuminance(rgbA.r,rgbA.g,rgbA.b); const y=getLuminance(rgbB.r,rgbB.g,rgbB.b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
describe('NewEVEn theme accessibility',()=>{
  for (const [mode, colors] of [['light',newevenLight],['dark',newevenDark]] as const) {
    for (const [fg,bg] of [
      ['foreground','background'],['muted-foreground','muted'],['primary-foreground','primary'],
      ['secondary-foreground','secondary'],['card-foreground','card'],['popover-foreground','popover'],
      ['sidebar-foreground','sidebar'],['selection-foreground','selection'],
      ['destructive-foreground','destructive'],['success-foreground','success'],['warning-foreground','warning'],['info-foreground','info'],
    ] as const) {
      it(`${mode}: ${fg} has at least 4.5:1 contrast on ${bg}`,()=>expect(contrast(colors[fg],colors[bg])).toBeGreaterThanOrEqual(4.5));
    }
  }
  it('preserves all seven original themes alongside NewEVEn',()=>{
    expect(BUILTIN_THEMES.map(t=>t.id)).toEqual(expect.arrayContaining(['builtin-neweven','builtin-flat-fields','builtin-qui','builtin-nord','builtin-catppuccin','builtin-solarized','builtin-roundcube-elastic','builtin-aurora-glass']));
  });
});
