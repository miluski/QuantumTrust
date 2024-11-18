FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21.0.3_9-jdk-alpine

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar

EXPOSE 8443

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]