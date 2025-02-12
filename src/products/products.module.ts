import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.model";
import { ProductService } from "./products.service";
import { ProductsController } from "./products.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Product], 'productsConnection')],
    providers: [ProductService],
    controllers: [ProductsController],
    exports: [ProductService],

})

export class ProductsModule { }