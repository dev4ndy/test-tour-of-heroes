import { convertToParamMap, ParamMap, Params } from "@angular/router";
import { ReplaySubject } from "rxjs";

export class ActivatedRouteStub {
    //share previous values with subscribers
    private subject = new ReplaySubject<ParamMap>();

    constructor(initialParams?: Params){
    }
    /**
     * The mock param
     */
    readonly paramMap = this.subject.asObservable();

    /**
     * Set the paramMap 
     */
    setParamMap(params?: Params){
        this.subject.next(convertToParamMap(params));
    }
}