import { Injectable } from "@angular/core";
import { HeroService } from "../../model/hero.service";
import { getTestHeroes } from "./heroes-data.test";


@Injectable()

export class HeroServiceTest extends HeroService {
    constructor(){
        super(null); //Is null we don't use a HttpClient, because it is a un helper for test.
    }

    heroes =  getTestHeroes();
}