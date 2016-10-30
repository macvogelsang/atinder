export class Event {
	constructor(
		public adminId: string,
		public name: string,
		public description: string,
		public dateStart ,
		public dateEnd,
		public checkStart,
		public checkEnd
	) {}
}
