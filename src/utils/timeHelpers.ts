// Morning   06-11  → BODY MIND DIET optimal
// Evening   18-22  → HEART SPIRIT optimal
export const isOptimal = (pillar: string) => {
  const h = new Date().getHours();
  if (h >= 6 && h < 11)   return ['BODY','MIND','DIET' ].includes(pillar);
  if (h >= 18 && h < 22)  return ['HEART','SPIRIT'     ].includes(pillar);
  return false;
};
export const randomGauge = (optimal: boolean) =>
  optimal ? 75 + Math.floor(Math.random()*25)
          : 30 + Math.floor(Math.random()*40);
