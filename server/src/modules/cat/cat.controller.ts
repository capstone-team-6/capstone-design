import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { Cat } from "src/core/entities/cat";
import { CatService } from "./cat.service";

@Controller("/cat")
export class CatController {
    constructor(@Inject(CatService) private catService: CatService) { }

    @Get(":name")
    async getCat(@Param("name") name: string): Promise<Cat | null> {
        return this.catService.findByName(name)
    }

    @Post("create")
    async createCat(@Body() body: Cat): Promise<void> {
        return this.catService.create(body)
    }
}