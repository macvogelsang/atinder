export class Event {
	constructor(
		public eventId: string,
		public adminId: string,
		public name: string,
		public description: string,
		public dateStart: string,
		public dateEnd: string,
		public checkStart: string,
		public checkEnd: string
	) {}
}
