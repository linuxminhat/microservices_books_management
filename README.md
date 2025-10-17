# microservices_books_management
## Chuẩn Bị Database
Tạo các database trong **MySQL**:

```sql
CREATE DATABASE mylibrarydb;
``` 
## Khởi Động Config Server  
cd config-server  
mvn spring-boot:run  
Kiểm tra hoạt động : [http://localhost:8889](http://localhost:8889)

## Khởi Động Eureka Server  
cd eureka-server  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8761](http://localhost:8761)

## Khởi Động API GATEWAY
cd api-gateway  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8090](http://localhost:8090)

## Khởi Động Book Service  
cd book-service  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8082/actuator/health](http://localhost:8082/actuator/health)

## Khởi Động Review Service  
cd review-service  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8084/actuator/health](http://localhost:8084/actuator/health)

## Khởi Động Admin Service  
cd admin-service  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8083/actuator/health](http://localhost:8083/actuator/health)

## Khởi Động Message Service  
cd message-service  
mvn spring-boot:run  
Kiểm tra hoạt động tại: [http://localhost:8085/actuator/health](http://localhost:8085/actuator/health)

## Khởi Động Frontend  
cd frontend/library-app  
npm start  
Kiểm tra hoạt động tại: [http://localhost:3000](http://localhost:3000)