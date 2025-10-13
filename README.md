# microservices_books_management
## Chuẩn Bị Database
Tạo các database trong **MySQL**:

```sql
CREATE DATABASE mylibrarydb;
``` 
## Khởi Động Config Server  
cd config-server  
mvn spring-boot:run  
Kiểm tra hoạt động : [http://localhost:8888](http://localhost:8889)

## Khởi Động Eureka Server  
cd eureka-server  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8761](http://localhost:8761)

