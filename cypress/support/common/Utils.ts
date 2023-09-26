import { DaysOfTheWeek } from "./constants";

export class Utils {
    static daysOfTheWeek(): Array<DaysOfTheWeek> {
        return Object.values(DaysOfTheWeek)
    }
}