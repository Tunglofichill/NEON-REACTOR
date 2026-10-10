const SUFFIXES = [
  '',
  ' K',   // 1e3
  ' M',   // 1e6
  ' B',   // 1e9
  ' T',   // 1e12
  ' Qa',  // 1e15
  ' Qi',  // 1e18
  ' Sx',  // 1e21
  ' Sp',  // 1e24
  ' Oc',  // 1e27
  ' No',  // 1e30
  ' Dc'   // 1e33
];

export function formatJoules(value: number): string {
  if (value < 0) {
    return '-' + formatJoules(Math.abs(value));
  }
  if (value < 1000) {
    return Math.floor(value).toLocaleString('en-US') + ' J';
  }

  const exp = Math.floor(Math.log10(value) / 3);
  if (exp < SUFFIXES.length) {
    const scaled = value / Math.pow(10, exp * 3);
    return `${scaled.toFixed(scaled < 10 ? 2 : 1)}${SUFFIXES[exp]} J`;
  }

  return value.toExponential(2) + ' J';
}

export function formatRate(value: number): string {
  if (value === 0) return '+0 J/s';
  if (value < 1000) {
    return `+${value.toFixed(1)} J/s`;
  }

  const exp = Math.floor(Math.log10(value) / 3);
  if (exp < SUFFIXES.length) {
    const scaled = value / Math.pow(10, exp * 3);
    return `+${scaled.toFixed(scaled < 10 ? 2 : 1)}${SUFFIXES[exp]} J/s`;
  }

  return `+${value.toExponential(2)} J/s`;
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${pad(hrs)}:${pad(remMins)}:${pad(secs)}`;
  }
  
  return `${pad(mins)}:${pad(secs)}`;
}
