export namespace main {
	
	export class Credentials {
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new Credentials(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}
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
	    clickedTeeth: {[key: number]: string};
	    firsttreatments: Treatment[];
	    secondTreatments: Treatment[];
	
	    static createFrom(source: any = {}) {
	        return new EmailData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.clickedTeeth = source["clickedTeeth"];
	        this.firsttreatments = this.convertValues(source["firsttreatments"], Treatment);
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
	export class PacientsData {
	    Name: string;
	    ClickedTeeth: {[key: number]: string};
	    firstTreatments: Treatment[];
	    secondTreatments: Treatment[];
	
	    static createFrom(source: any = {}) {
	        return new PacientsData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.ClickedTeeth = source["ClickedTeeth"];
	        this.firstTreatments = this.convertValues(source["firstTreatments"], Treatment);
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

