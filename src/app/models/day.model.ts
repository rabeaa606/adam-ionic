export class Day {
    constructor(
        public id: string,
        public day: number,
        public iscurrent: boolean,
        public dates: string[],
        public start: number,
        public end: number,
        public date: Date,
    ) { }
}
