import fs from 'fs';

function parseDatePt(dtStr: string): string {
  if (!dtStr) return '2026-10-17';
  const parts = dtStr.trim().split('-');
  if (parts.length < 3) return dtStr;
  const day = parts[0].padStart(2, '0');
  const monthMap: Record<string, string> = {
    jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
    jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
  };
  const mKey = parts[1].toLowerCase().slice(0, 3);
  const month = monthMap[mKey] || '10';
  let year = parts[2];
  if (year.length === 2) year = '20' + year;
  return `${year}-${month}-${day}`;
}

function parseTimeToHours(timeStr: string): number | null {
  if (!timeStr || !timeStr.includes(':')) return null;
  const parts = timeStr.trim().split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return Math.round((h + m / 60) * 100) / 100;
}

function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || !timeStr.includes(':')) return null;
  const parts = timeStr.trim().split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

console.log('Test 17-set-26:', parseDatePt('17-set-26'));
console.log('Test 2-out-26:', parseDatePt('2-out-26'));
console.log('Test 0:16 MTTR:', parseTimeToHours('0:16'));
console.log('Test 40:45 MTTR:', parseTimeToHours('40:45'));
console.log('Test 0:05 MTTA:', parseTimeToMinutes('0:05'));
