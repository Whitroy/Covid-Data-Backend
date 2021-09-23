export interface Report {
	case: Case;
	death: Death;
	test: Test;
	recovery: Recovery;
}

export interface Death {
	total: number;
	new?: number;
	perMillion?: number;
}

export interface Case {
	total: number;
	new?: number;
	active?: number;
	critical?: number;
	perMillion?: number;
}

export interface Recovery {
	total?: number;
	new?: number;
}

export interface Test {
	total?: number;
	perMillion?: number;
}
