export function getDatesWith30DaysInterval(
  startDate: Date,
  numberOfDates: number,
): Date[] {
  const dates: Date[] = [];
  const startDateTime = startDate.getTime();

  for (let i = 0; i < numberOfDates; i++) {
    const newDate = new Date(
      startDateTime + (i + 1) * 30 * 24 * 60 * 60 * 1000,
    );
    dates.push(newDate);
  }

  return dates;
}

export function getCurrentMonthRange() {
  // Get the current date
  const currentDate = new Date();

  // Get the first day of the current month
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  // Calculate the last day of the current month
  const nextMonthFirstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  ) as any;
  const lastDay = new Date(nextMonthFirstDay - 1);

  return { start: firstDay, end: lastDay };
}
