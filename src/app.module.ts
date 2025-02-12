import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.model';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.model';

@Module({
  imports: [
     // Anslutning för Users
     TypeOrmModule.forRoot({
      name: 'usersConnection', // Unikt namn för anslutningen
      type: 'sqlite',
      database: 'users.db',
      entities: [User],
      synchronize: true,
    }),
    // Anslutning för Products
    TypeOrmModule.forRoot({
      name: 'productsConnection', // Unikt namn för anslutningen
      type: 'sqlite',
      database: 'products.db',
      entities: [Product],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
