import { Controller, Get, Post, Put, Delete, Body, Res, Param, HttpStatus } from "@nestjs/common";
import { ProductService } from "./products.service";
import { Response } from "express";
import { Product } from "./product.model";



@Controller("products")

export class ProductsController {
    constructor(private productService: ProductService) { }

    // Get all products
    @Get()
    async getAllProducts(): Promise<any[]> {
        return this.productService.getAllProducts();
    }

    // Get product by ID
    @Get(":id")
    async getProductById(@Param("id") id: number): Promise<any> {
        return this.productService.getProductById(id);
    }

    // Create a new product
    @Post()
    async createProduct(
        @Body("category") category: string,
        @Body("name") name: string,
        @Body("description") description: string,
        @Body("price") price: number,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const product = await this.productService.createProduct(category, name, description, price);
            return res.status(HttpStatus.CREATED).json({ message: "Produkt skapad", productId: product.id });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Kunde inte skapa produkt", error });
        }
    }

    // Update a product
    @Put(":id")
    async updateProduct(
        @Param("id") id: number,
        @Body() productData: Partial<Product>,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const updatedProduct = await this.productService.updateProduct(id, productData);
            return res.status(HttpStatus.OK).json(updatedProduct);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Något gick fel vid uppdatering av produkt" });
        }
    }

    // Delete a product
    @Delete(":id")
    async deleteProduct(
        @Param("id") id: number,
        @Res() res: Response
    ): Promise<any> {
        try {
            await this.productService.deleteProduct(id);
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Kunde inte ta bort produkt",
                error: error.response || error.message,  
            });
        }
    }

}