export class Event {
	constructor(
		public adminId: string,
		public name: string,
		public description: string,
		public dateStart: string,
		public dateEnd: string,
		public checkStart: string,
		public checkEnd: string
	) {}
}
