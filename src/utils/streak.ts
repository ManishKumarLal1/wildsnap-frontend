/**
 * Return today's date as YYYY-MM-DD
 * using the device's local timezone.
 */
export function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/**
 * Convert YYYY-MM-DD into a Date.
 *
 * We deliberately construct the date using
 * local time instead of relying on
 * new Date("YYYY-MM-DD"), which can cause
 * timezone problems.
 */
function parseDate(dateString: string): Date {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}


/**
 * Return the number of calendar days
 * between two dates.
 */
function differenceInDays(
  firstDate: string,
  secondDate: string
): number {
  const first = parseDate(firstDate);
  const second = parseDate(secondDate);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return Math.round(
    Math.abs(
      second.getTime() -
      first.getTime()
    ) / millisecondsPerDay
  );
}


/**
 * Calculate the new streak after
 * an observation is made today.
 *
 * Rules:
 *
 * First observation:
 * 0 → 1
 *
 * Same day:
 * streak stays unchanged
 *
 * Next consecutive day:
 * streak + 1
 *
 * Missed one or more days:
 * streak resets to 1
 */
export function calculateNewStreak(
  currentStreak: number,
  lastObservationDate: string | null,
  today: string = getTodayDate()
): number {

  // First ever observation
  if (!lastObservationDate) {
    return 1;
  }


  // Observation already made today
  if (lastObservationDate === today) {
    return currentStreak;
  }


  const daysSinceLastObservation =
    differenceInDays(
      lastObservationDate,
      today
    );


  // Consecutive day
  if (daysSinceLastObservation === 1) {
    return currentStreak + 1;
  }


  // Missed at least one day
  return 1;
}