export namespace main {
	
	export class Treatment {
	    text: string;
	    quantity: number;
	    onePrice: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new Treatment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.text = source["text"];
	        this.quantity = source["quantity"];
	        this.onePrice = source["onePrice"];
	        this.total = source["total"];
	    }
	}
	export class EmailData {
	    name: string;
	    clickedTeeth: number[];
	    Firsttreatments: Treatment[];
	    secondTreatments: Treatment[];
	
	    static createFrom(source: any = {}) {
	        return new EmailData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.clickedTeeth = source["clickedTeeth"];
	        this.Firsttreatments = this.convertValues(source["Firsttreatments"], Treatment);
	        this.secondTreatments = this.convertValues(source["secondTreatments"], Treatment);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

