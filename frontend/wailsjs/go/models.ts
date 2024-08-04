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
	    disease: string;
	    comment: string;
	    text: string;
	    quantity: number;
	    onePrice: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new Treatment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.disease = source["disease"];
	        this.comment = source["comment"];
	        this.text = source["text"];
	        this.quantity = source["quantity"];
	        this.onePrice = source["onePrice"];
	        this.total = source["total"];
	    }
	}
	export class Phase {
	    id: number;
	    clickedTeeth: number[];
	    days: string;
	    treatments: Treatment[];
	
	    static createFrom(source: any = {}) {
	        return new Phase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.clickedTeeth = source["clickedTeeth"];
	        this.days = source["days"];
	        this.treatments = this.convertValues(source["treatments"], Treatment);
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
	export class EmailData {
	    dataUrl: string;
	    email: string;
	    name: string;
	    phases: Phase[];
	
	    static createFrom(source: any = {}) {
	        return new EmailData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dataUrl = source["dataUrl"];
	        this.email = source["email"];
	        this.name = source["name"];
	        this.phases = this.convertValues(source["phases"], Phase);
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
	    email: string;
	    name: string;
	    phases: Phase[];
	
	    static createFrom(source: any = {}) {
	        return new PacientsData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.email = source["email"];
	        this.name = source["name"];
	        this.phases = this.convertValues(source["phases"], Phase);
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
	
	export class SearchItem {
	
	
	    static createFrom(source: any = {}) {
	        return new SearchItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

