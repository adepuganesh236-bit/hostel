import { WEEKLY_MENU, DAILY_TIMINGS, FOOD_RULES } from './demoData'

export const getTodayDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

export { WEEKLY_MENU, DAILY_TIMINGS, FOOD_RULES }