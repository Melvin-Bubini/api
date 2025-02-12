import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.model";
import { Repository } from "typeorm";


@Injectable()

export class ProductService {
    constructor(
        @InjectRepository(Product, 'productsConnection')
        private readonly productRepository: Repository<Product>,
    ) { }

    async getAllProducts(): Promise<Product[]> {
        try {
            const products = await this.productRepository.find();

            if (!products.length) {
                throw new HttpException("Inga produkter finns", HttpStatus.NOT_FOUND);
            }

            return products;
        } catch (error) {
            throw new HttpException(
                error.message || "Ett internt serverfel uppstod vid hämtning av produkter",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async getProductById(id: number): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id: Number(id) } });

            if (!product) {
                throw new HttpException("Produkten hittades inte", HttpStatus.NOT_FOUND);
            }

            return product;
        } catch (error) {
            throw new HttpException(
                error.message || "Ett internt serverfel uppstod vid hämtning av produkten",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async createProduct(category: string, name: string, description: string, price: number): Promise<Product> {
        try {
            const existingName = await this.productRepository.findOne({ where: { name } });

            if (existingName) {
                throw new HttpException("Produkten finns redan", HttpStatus.BAD_REQUEST);
            }

            const newProduct = await this.productRepository.create({ category, name, description, price });
            return await this.productRepository.save(newProduct);
        } catch (error) {
            console.error("Fel vid skapande av produkt:", error.message);
            throw new HttpException(error.message || "Något gick fel vid skapande av produkt", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id } });
    
            if (!product) {
                throw new HttpException("Produkten hittades inte", HttpStatus.NOT_FOUND);
            }
    
            // Uppdatera produkten med nya värden
            const updatedProduct = { ...product, ...productData };
    
            return await this.productRepository.save(updatedProduct);
        } catch (error) {
            console.error("Fel vid uppdatering av produkt:", error.message);
            throw new HttpException(
                error.message || "Något gick fel vid uppdatering av produkt",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteProduct(id: number) {
        try {
            const productToDelete = await this.productRepository.findOne({ where: { id } });
            if (!productToDelete) {
                throw new HttpException("Produkten hittades inte", HttpStatus.NOT_FOUND);
            }

            return await this.productRepository.delete(productToDelete);
        } catch (error) {
            console.error("Fel vid borttagning av produkt:", error.message);
            throw new HttpException(error.message || "Något gick fel vid borttagning av produkt", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}